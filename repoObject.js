
const axios = require('axios');
function RepoObj(username,reponame) { 
    this.username = username;
    this.reponame = reponame;
    this.repoURL = `https://github.com/${username}/${reponame}`; 
    this.repoliveURL = `https://raed-ra.github.io/${reponame}`; 

    this.fetchContributors = async function() {
        const queryUrl = `https://api.github.com/repos/${this.username}/${this.reponame}/contributors`;
        await axios.get(queryUrl).then((response)=>{
            //console.log(response.data)// this.contributors = response
            this.contributorsNum = response.data.length
            let contributorname = response.data.map((contributor)=>contributor.login)
            //console.log(contributorname)
            let contributionsnum = response.data.map((contributor)=>contributor.contributions)
            //console.log(contributionsnum)
            this.contributionsdata = Object.assign(...contributorname.map((k, i) => ({[k]: contributionsnum[i]})))
            //this.contributionsdata = Object.assign(contributorname,contributionsnum)
            //console.log(this.contributionsdata)
        }).catch((err)=> console.log(err))
        return this
    };

    this.repostats = async function() {
        const queryUrl = `https://api.github.com/repos/${this.username}/${this.reponame}/stats/contributors`;
        await axios.get(queryUrl).then((response)=>{
            this.authorLengthNum = response.data.length
            let authorname = response.data.map((auth)=>auth.author.login)
            let authorcommits = response.data.map((auth)=>auth.total)
            this.commitdata = Object.assign(...authorname.map((k, i) => ({[k]: authorcommits[i]})))
        }).catch((err)=> console.log(err))
        return this
    };
};

    module.exports = RepoObj;