import React from 'react';

const delay = ms => new Promise(res => setTimeout(res, ms));

async function logout ()
{
    await delay(5000);
    localStorage.setItem('user',JSON.stringify({_id:false,A:false,Ar:false,N:false}))
    window.location.href = '/SignIN';
}
function UKnoob(){
        logout()
        return(
            <div className="d-flex justify-content-center">
                <img src="https://pics.me.me/nice-try-nice-try-bro-make-a-meme-53165547.png"alt='LoL LoL LoL LoL' width="800" height="600"/>
            </div>
        )
    }
export default UKnoob