import { useState } from "react";

function ProgressBar({fill}){
    
    return(
        <>
            <div className='bg-white h-7 p-1 m-2 w-[88%] rounded-2xl shadow-lg hover:shadow-xl rounded-lg transition-shadow duration-300 flex '>
                <p
                    className={`p-2 rounded-full transition-all duration-500 
                        ${
                        fill === 0 ? 'bg-white' : 'bg-broGreen'
                    }`}
                    style={{ width: `${fill}%` }}
                    >
                    
                </p>

            </div>
            </>
    );
}

export default ProgressBar;