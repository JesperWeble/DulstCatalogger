import {token, projectId} from './config.js'

const ref = 'master';
const repositoryPath = `https://dev.dulst.com/api/v4/projects/${projectId}/repository`
// const filePath = encodeURIComponent('src/cards/unit/Adored City Girl 65556937.yml'); // Find a specific file
// const fileUrl = `${repositoryPath}/files/${filePath}/raw?ref=${ref}`
const treePath = encodeURIComponent('src/cards/unit'); // Find a whole folder (or Tree)
const treeUrl = `${repositoryPath}/tree?path=${treePath}&ref=${ref}`

fetch(`${treeUrl}`,
{
    headers:
    {
        'PRIVATE-TOKEN': token
    }
})
.then(res => res.text())
.then(data => console.log(data))
.catch(err => console.error(err));