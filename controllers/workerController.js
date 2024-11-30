const Worker = require("../models/workerModel");
const asyncHandler = require("express-async-handler");

// DONE: updated
exports.worker_info_get = asyncHandler(async (req, res) => {
    let worker = await Worker.findById(req.user.id)
        .populate("projects tasks")
        .select("-passwordHash");
    if (!worker) {
        res.status(404).json({ message: "worker not found" });
    }
    res.json(worker);
});

// DONE: updated
exports.worker_info_update = asyncHandler(async (req, res) => {
    let worker = await Worker.findById(req.user.id);
    if (!worker) {
        res.status(404).json({ message: "worker not found" });
    }
    worker.name = req.body.name || worker.name;
    worker.email = req.body.email || worker.email;

    await worker.save();
    res.json(worker);
});

// DONE: updated
exports.worker_account_delete = asyncHandler(async (req, res) => {
    let worker = await Worker.findById(req.owner.id);
    if (!worker) {
        res.status(404).json({ message: "worker not found" });
    }
    await worker.remove();
    // delete the cookie
    res.clearCookie("token");
    res.json({ message: "worker deleted" });
});
