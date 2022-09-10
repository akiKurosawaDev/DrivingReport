const GAS = 'https://script.google.com/macros/s/AKfycbzKdPwnQfxlZ0vcO88aq6KDD-JoMeKxDqqIPVeVQtlWI9sIvK5UGTxigOkRJ2EmY5E1XA/exec';

function fileupload(ev) {
    const reader = new FileReader();
    const image = new Image();
    const minimg = new Image();

    reader.onloadend = () => {
        image.onload = () => {
            const imgType = 'image/jpeg';
            const imgWidth = 400;
            const imgHeight = image.height * (400 / image.width);

            const canvas = document.createElement('canvas');
            canvas.width = imgWidth;
            canvas.height = imgHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, imgWidth, imgHeight);
            minimg.src = canvas.toDataURL(imgType);
        }
        image.src = reader.result;
    }

    //console.log(ev);
    console.log(image);
    
    reader.readAsDataURL(ev.target.files[0]);
    //reader.addEventListener('load', dataPost);
    minimg.addEventListener('load', dataPost);
}

/**
 * Image データを HTML POST 送信します。
 * @param {Event} ev 
 */
function dataPost(ev) {
    const now = new Date(Date.now() + ((new Date).getTimezoneOffset() + 9 * 60) * 60 * 1000);
    let nowstr = `${now.getFullYear().toString()}-${('00' + (now.getMonth() + 1).toString()).slice(-2)}-${('00' + now.getDate().toString()).slice(-2)}`;
    nowstr = nowstr + `_${('00' + now.getHours().toString()).slice(-2)}:${('00' + now.getMinutes().toString()).slice(-2)}:${('00' + now.getSeconds().toString()).slice(-2)}`;

    const data = {
        title: "DriveRportPict_" + nowstr,
        image: ev.target.src
    }

    let opt = {
        method: 'POST',
        body: JSON.stringify(data)
    }

    fetch(GAS, opt)
        .then(Response => {
            if (!Response.ok) throw new Error(`${Response.status} ${Response.statusText}`);
            let result = Response.json();
            return result;
        })
        .then(Result => {
            console.log(Result);
        })
        .catch(Reason => {
            console.log(Reason);
        });
}