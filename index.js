const fs = require("fs");
const inquirer = require("inquirer");
const axios = require('axios');
const util = require("util");
const {render} = require('mustache')
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
const repoObject = require("./repoObject");


getInfo();

async function getInfo() {
    try {
        const { username } = await askUsername();
        //console.log({username})
        const githubdata  = await getGithubdata(username);
        //console.log(githubdata);
        let repos = {};
        githubdata.data.forEach((repo,index) => {
            repos[repo.name] = repo.fullname
        })
        const targetrepo = await whichRepo(repos);
        //console.log(targetrepo.repochoice);
        const repo = new repoObject(username,targetrepo.repochoice)
        await repo.fetchContributors()
        await repo.repostats()
        console.log(repo)
        const { description, Tech1, Tech2, APIref, license, author } = await userdata();
        let data = { description, Tech1, Tech2, APIref, license, author };
        //console.log(data)
        let template = (await readFileAsync(`./README.md`)).toString()
        //console.log(template)
        let githubMdfile = render(template, data)
        //console.log(githubMdfile);
        writeFileAsync(`./${repo.reponame}.md`,githubMdfile)
        writeFileAsync(`./githubData.json`,JSON.stringify(githubdata.data))
        console.log(`mdfile for ${repo.reponame} is saved!`)
    }   
    catch (err) {
        console.log(err)
    }
};

function askUsername() {
    return inquirer.prompt([
        {
            message: "What is your github username?",
            name: "username",
            type: 'input',
        },
    ]);
}

function whichRepo(repos) {
    return inquirer.prompt([
        {
            message: "What is repo you want to generate readme file for?",
            name: "repochoice",
            type: 'list',
            choices: Object.keys(repos)
        },
    ]);
}

function getGithubdata(username) {
    console.log({username})
    const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
    return axios.get(queryUrl)
}

function userdata(question) {
    return inquirer.prompt([
        {
            name: "description",
            type: 'input',
            message: "In two lines explain the description?",
        },
        {
            type: 'input',
            name: 'Tech1',
            message: 'Name one technology used?',
        },
        {
            type: 'input',
            name: 'Tech2',
            message: 'Name a second technology used?',
        },
        {
            type: 'input',
            name: 'APIref',
            message: 'What API references used?',
        },
        {
            type: 'input',
            name: 'license',
            message: 'What is the license?',
        },
        {
            type: 'input',
            name: 'author',
            message: 'What is the author twitter address?',
        },
    ]);
}

