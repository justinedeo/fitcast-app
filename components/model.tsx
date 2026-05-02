// components/model.tsx
// All of this is temporary and I think incorrect

/* const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.EXPO_GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateContent = async (prompt) => {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return result.response.text;
}

*/



// I think the video linked below can be adapted to set up our LLM. It has information on analyzing images with Gemini and also enables history which is important for our project.
// https://www.youtube.com/watch?v=VN_VcBHRo1A&t=72s 