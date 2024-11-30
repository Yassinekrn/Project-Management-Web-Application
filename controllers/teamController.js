const Project = require("../models/projectModel");
const Task = require("../models/taskModel");
const AsyncHandler = require("express-async-handler");

exports.team_update_get = AsyncHandler(async (req, res) => {
    const team = await Team.findById(req.params.teamId).populate(
        "members",
        "email"
    );
    if (!team) {
        return res.status(404).send("Team not found");
    }
    res.render("team_update", {
        title: "Update Team",
        owner: req.owner,
        team,
    });
});

exports.team_update_post = AsyncHandler(async (req, res) => {
    let { name, description, members } = req.body;
    members = members.split(",").map((member) => member.trim());

    const team = await Team.findById(req.params.teamId);
    if (!team) {
        return res.status(404).send("Team not found");
    }

    if (team.name != undefined && team.name !== name) {
        team.name = name;
    }
    if (team.description != undefined && team.description !== description) {
        team.description = description;
    }
    if (team.members != undefined) {
        // find members by email and add them to the team
        members = await Member.find({ email: { $in: members } });
        const newMemberIds = members.map((member) => member._id);
        console.log("newMemberIds:", newMemberIds);
        team.members = newMemberIds; // update the members array
    }
    // for every member in the team, add the project to their projects array if it is not already there
    for (const memberId of team.members) {
        const member = await Member.findById(memberId);
        if (!member.projects.includes(team.project)) {
            member.projects.push(team.project);
            await member.save();
        }
    }

    console.log("team.members:", team.members);
    await team.save();
    res.redirect(`/projects/${team.project}`);
});

exports.team_create_get = (req, res) => {
    res.render("team_form", {
        title: "Create Team",
        owner: req.owner,
        projectId: req.params.projectId,
    });
};

// Handle team creation on POST
exports.team_create_post = async (req, res) => {
    try {
        if (!req.body.name || !req.body.description || !req.body.members) {
            return res.status(400).send("All fields are required");
        }

        let members = req.body.members.split(",");
        members = members.map((member) => member.trim());

        // find members by email and add them to the team
        members = await Member.find({ email: { $in: members } });
        if (members.length === 0) {
            return res
                .status(404)
                .send("No members found with the provided emails");
        }

        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).send("Project not found");
        }

        const team = new Team({
            name: req.body.name,
            description: req.body.description,
            members: members.map((member) => member._id),
            project: req.params.projectId,
        });

        await team.save();

        // add team to project

        project.teams.push(team._id);
        await project.save();

        // add project to each member
        for (const member of members) {
            if (!member.projects.includes(req.params.projectId)) {
                member.projects.push(req.params.projectId);
                await member.save();
            }
        }

        res.redirect("/projects/" + req.params.projectId);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Handle adding a member to a team on POST
exports.team_add_member_post = async (req, res) => {
    try {
        const team = await Team.findById(req.body.teamId);
        if (!team) {
            return res.status(404).send("Team not found");
        }
        team.members.push(req.body.memberId);
        await team.save();
        res.redirect(`/teams/${team.id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Handle removing a member from a team on POST
exports.team_remove_member_post = async (req, res) => {
    try {
        const team = await Team.findById(req.body.teamId);
        if (!team) {
            return res.status(404).send("Team not found");
        }
        team.members = team.members.filter(
            (member) => member !== req.body.memberId
        );
        await team.save();
        res.redirect(`/teams/${team.id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Handle team deletion on POST
exports.team_delete_post = async (req, res) => {
    console.log("team_delete_post called with teamId:", req.params.teamId);
    try {
        const team = await Team.findById(req.params.teamId);
        if (!team) {
            return res.status(404).send("Team not found");
        }

        const project = await Project.findById(team.project);
        if (!project) {
            return res.status(404).send("Project not found");
        }

        // Remove the team from the project
        project.teams = project.teams.filter(
            (teamId) => teamId.toString() !== team._id.toString()
        );
        await project.save();

        // Remove the project from each team member's projects array if they are not in any other team in the project
        for (const memberId of team.members) {
            const member = await Member.findById(memberId);
            if (member) {
                // Check if the member is in any other team in the project
                const otherTeamsInProject = await Team.find({
                    project: project._id,
                    members: member._id,
                    _id: { $ne: team._id },
                });
                if (otherTeamsInProject.length === 0) {
                    member.projects = member.projects.filter(
                        (projectId) =>
                            projectId.toString() !== project._id.toString()
                    );
                    await member.save();
                }
            }
        }

        // Remove assignedTo from tasks if the member is not in any other team in the project
        const tasks = await Task.find({
            project: project._id,
            assignedTo: { $in: team.members },
        });
        for (const task of tasks) {
            const otherTeamsInProject = await Team.find({
                project: project._id,
                members: task.assignedTo,
                _id: { $ne: team._id },
            });
            if (otherTeamsInProject.length === 0) {
                task.assignedTo = null;
                await task.save();
            }
        }

        await Team.findByIdAndDelete(req.params.teamId);

        res.redirect("/projects/" + project._id);
    } catch (error) {
        console.error("Error deleting team:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete team.",
        });
    }
};
