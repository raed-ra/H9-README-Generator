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
        const imageurl = githubdata.data[0].owner.avatar_url;
        //console.log(imageurl)
        const targetrepo = await whichRepo(repos);
        //console.log(targetrepo.repochoice);
        const repo = new repoObject(username,targetrepo.repochoice)
        await repo.fetchContributors()
        await repo.repostats()
        //console.log(repo)
        const { description, Tech1, Tech2, testing, usage, license, badge, author  } = await userdata();
        const projecttitle = repo.reponame
        const githublink = repo.repoURL
        const livelink = repo.repoliveURL
        const contributors = repo.contributionsdata
        const committers = repo.commitdata
        let data = { description, Tech1, Tech2, testing, usage, license, badge, author , projecttitle, imageurl, githublink, livelink, contributors, committers};
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
    const queryUrl = `https://api.github.com/users/${username}/repos`;
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
            name: 'testing',
            message: 'How is testing performed?',
        },
        {
            type: 'input',
            name: 'usage',
            message: 'Whats the usage?',
        },
        {
            type: 'input',
            name: 'license',
            message: 'What is the license?',
        },
        {
            type: 'input',
            name: 'badge',
            message: 'Include license badge?',
            default: 'https://img.shields.io/badge/License-MIT-green'
        },
        {
            type: 'input',
            name: 'author',
            message: 'What is the author twitter address?',
        },
    ]);
}




