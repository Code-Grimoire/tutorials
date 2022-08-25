const uploadArea = document.querySelector('.upload-area');
const uploadAreaHint = document.querySelector('.upload-area span');
const uploadBtn = document.querySelector('#fileUploadBtn');
const fileContainer = document.querySelector('.file-container');
const uploadInfo = document.querySelector('.uploadInfo > h4');

let files = [];
let filesPrevLength = 1;

document.querySelector('#fileUploader').addEventListener('change', e => {
    e.preventDefault();
    filesPrevLength = files.length;
    files.push(...(e.target.files));
    console.log(files);
    totFileStateChange();
})

uploadBtn.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('#fileUploader').click();
})
uploadArea.addEventListener('dragleave', e => {
    uploadAreaHint.classList.remove('active');
    uploadBtn.style.display = "block";
    uploadInfo.innerHTML = "Drop File(s) here to Upload<br><br>OR";
})
uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadAreaHint.classList.add('active');
    uploadBtn.style.display = "none";
    uploadInfo.innerHTML = "Drop to Add";
})
uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadBtn.style.display = "block";
    uploadInfo.innerHTML = "Drop File(s) here to Upload<br><br>OR";
    uploadAreaHint.classList.remove('active');
    filesPrevLength = files.length;
    files.push(...(e.dataTransfer.files));
    totFileStateChange();
})

//Handles changes if a new file is added via upload or drag and drop.
function totFileStateChange() {
    if (files.length == 0) {
        fileContainer.classList.add('empty');
        uploadInfo.innerHTML = "Drop File(s) here to Upload<br><br>OR";
        uploadBtn.innerHTML = "BROWSE FILES";
        filesPrevLength = 0;
        return;
    } 
    //If a new file is added to array, then add a new node for that file.
    if (files.length > filesPrevLength) {
        uploadBtn.innerHTML = "ADD MORE";
        fileContainer.classList.remove('empty');
        for (let i = filesPrevLength; i < files.length; i++) {
            let node = document.createElement("div");
            node.setAttribute("filesIndex", `${i}`);
            let deleteBtn = document.createElement("button");
            deleteBtn.classList.add("fileDeleteBtn");
            deleteBtn.style = "position: absolute; right: 5px; top: 5px; width: 15px; height: 15px";
            deleteBtn.textContent = "X";
            deleteBtn.onclick = () => {
                deleteBtn.parentElement.remove();
                files.splice(deleteBtn.parentElement.filesIndex,1);
                filesPrevLength = files.length;
                totFileStateChange();
            };
            node.append(deleteBtn);
            //node.innerHTML = files[i].name;
            if (files[i].type.slice(0,5) == "image") {
                node.style.background = `url(${URL.createObjectURL(files[i])}) center no-repeat`;
                node.style.backgroundSize = "contain";
            }
            else if (files[i].type == "application/pdf") {
                node.innerHTML = `<embed src="${URL.createObjectURL(files[i])}" width="100%" height="100%" controls/>`;
            } else {
                node.innerHTML = `${files[i].name}`;
            }
            fileContainer.append(node);
        }
    }
    let totalSize = 0;
    files.forEach(e => {totalSize += e.size;});
    uploadInfo.innerHTML = `${files.length} Files Selected <br><br>Total Size: ${formatBytes(totalSize)}`;
   
}

//Function to convert byte to a readable size.
//Source - https://stackoverflow.com/a/18650828/11231119
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}