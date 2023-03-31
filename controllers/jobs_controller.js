// fetching jobs from api
const fetch = (url) => import('node-fetch').then(({default: fetch}) => fetch(url));
module.exports.jobPage = async function (req, res) {
    try{
        const response = await fetch('https://remotive.com/api/remote-jobs?limit=12');
        const jobsData = await response.json();
        return res.render('jobsList', {
            title: "Jobs Available",
            jobs : jobsData.jobs
        });
    }catch(error){
       console.log('Error in fetching the jobs:',error);
    }
    
};