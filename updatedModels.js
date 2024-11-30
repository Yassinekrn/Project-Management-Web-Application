// Definition of updated models and their relationships
const updatedModels = {
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

        owner: "ObjectId(owner)",
        tasks: "Array of ObjectId(task)", // ease of access

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
    worker: {
        name: "String",
        email: "String",
        passwordHash: "String",

        tasks: "Array of ObjectId(task)", // ease of access
        projects: "Array of ObjectId(project)", // ease of access

        createdAt: "Date",
    },
};

const needs = {
    q1: "get member info, as well as his projects and tasks",
    q2: "get owner info, as well as his projects",
    q3: "get project info, as well as its tasks and teams",
    q4: "get team info, as well as its members",
};
