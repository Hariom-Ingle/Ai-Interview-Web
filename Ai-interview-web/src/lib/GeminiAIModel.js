import {GoogleGenerativeAI, HarmCategory,HarmBlockThreshold } from '@google/generative-ai'
// import dotenv from 'dotenv'

// dotenv.config();

const apiKey = process.env.NODE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);


const model = genAI.getGenerativeModel({
    model:'gemini-1.5-flash',
})

const generationConfig = {
    temperature :1,
    topP:0.95,
    topK:64,
    maxOutputTokens:8192,
    responseMineType: 'text/plain',
};

const  safetySetting =[

    {
        category:HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold :HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category:HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold :HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category:HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold :HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category:HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold :HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },

];

 
    export const    chatSession = model.startChat({
        generationConfig,
        safetySetting,
        // history:[
        //     {
        //         role:"user",
        //         parts:[
        //             {
        //                 text:"Job Position: Full stack Developer, job description: HTML CSS REACT "
        //             }
        //         ]
        //     },
        //     {
        //         role:'model',
        //         parts:[ " ``` json\n [\n \"question \" : \Describe your  expreince  with role  " 

        //         ],
        //     },
        // ],
    });
    // const  result  = await  chatSession.sendMessage("INSERT_INPUT_HERE")
    // console.log(result.response.text())
 
 
 