const aiService = require("../services/ai.service");


module.exports.getResponce = async (req, res) => {
    const prompt = req.query.prompt;
    const result = await aiService(prompt);
    res.send(result);

    if(!prompt){
        return res.status(400).send("Prompt is required");
    }
}

