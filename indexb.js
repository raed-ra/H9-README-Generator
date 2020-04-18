const fs = require("fs")
const inquirer = require("inquirer");

getInfo();

async function getInfo() {
    try {
        const { name, location, bio, linkedin, github } = await inquirer
            .prompt([
                {
                    message: "What is your name?",
                    name: "name",
                    type: 'input',
                },
                {
                    type: 'input',
                    name: 'location',
                    message: 'what suburb do you live in?',
                },
                {
                    type: 'input',
                    name: 'bio',
                    message: 'Tell us abit about yourself! ',
                },
                {
                    type: 'input',
                    name: 'linkedin',
                    message: 'What is your linkedin url?',
                },
                {
                    type: 'input',
                    name: 'github',
                    message: 'What is your github url?',
                },
            ]);
        console.log({ name, location, bio, linkedin, github });
        generateHtml(name,location,bio,linkedin,github)
            .then(($html)=>console.log($html))
            .catch((error) => console.log(error))
        // const $html = generateHtml(name, location, bio, linkedin, github)
        //     .then((response) => {
        //         return 'hello'
        //     })
        //     .then((response) => console.log(response))
        //console.log($html)
    }
    catch (err) {
        console.log(err)
        //     if(err.isTryError) {
        //         console.log("1")// prompt couldn't be rendered in the current environment
        //     } else {
        //         console.log("2")// Something else went wrong
        //     }
    }
};

function generateHtml(name, location, bio, linkedin, github) {
    return new Promise(function (resolve, reject) {
        const profileHTML = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${name}</title>
                </head>
                <body>
                    <h2>${name}</h2>
                    <h3>Location: ${location}</h3>
                    <p>${bio}</p>
                    <p>Linkdin: ${linkedin}</p>
                    <p>Github: ${github}</p>
                </body>
                </html>
                `;
        //throw new SyntaxError
        resolve(profileHTML);
        var err = true;
        if (err) {
            reject(console.error("checking error"))
        }
    });
}
