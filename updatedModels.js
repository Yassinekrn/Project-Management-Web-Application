const updatedModels = {
    team: {
        name: "String",
        description: "String",

        members: "Array of ObjectId(member)",
        project: "ObjectId(project)",

        createdAt: "Date",
        updatedAt: "Date",
    },
    task: {
        title: "String",
        description: "String",
        status: "String",
        progress: "Number",

        project: "ObjectId(project)",
        assignedTo: "ObjectId(member)",
        createdBy: "ObjectId(owner)",

        createdAt: "Date",
        updatedAt: "Date",
    },
    project: {
        name: "String",
        description: "String",

        teams: "Array of ObjectId(team)",
        owner: "ObjectId(owner)",

        createdAt: "Date",
        updatedAt: "Date",
    },
    owner: {
        name: "String",
        email: "String",
        passwordHash: "String",

        projects: "Array of ObjectId(project)", // ease of access

        createdAt: "Date",
    },
    member: {
        name: "String",
        email: "String",
        passwordHash: "String",

        createdAt: "Date",
    },
    memberships: {
        role: "String",

        team: "ObjectId(team)",
        member: "ObjectId(member)",

        createdAt: "Date",
    },
};

const needs = {
    q1: "get member info, as well as his projects and tasks",
    q2: "get owner info, as well as his projects",
    q3: "get project info, as well as its tasks and teams",
    q4: "get team info, as well as its members",
};
