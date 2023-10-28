import './App.css';
import React, { useState } from 'react';
import styled from 'styled-components';


const IconDiv = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: row;
`

const NeonText = ({ text }) => {
    return (
        <div className="neon-text-flicker">
            {text}
        </div>
    )
}


const NeonObj = ({ data }) => {
    const url = data.url;
    const name = data.name;
    const icon = data.icon;
    const like = data.like;
    const dislike = data.dislike;
    const report = data.report;

    return (
        <div className="neon-box">
            <div><img src={icon} /></div>
            <div>
                <div>{name}</div>
                <div>{url}</div>
            </div>
            <IconDiv>
                <div>
                    <svg class="heart" width="60" height="24" viewBox="0 0 60 24" fill="none">
                    <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    </svg> </div><div>{like}</div>
                <div>
                    <svg width="100" height="100" viewBox="0 0 100 100">
                    <line x1="0" y1="100" x2="100" y2="0" stroke-width="1" stroke="black"/>
                    <line x1="0" y1="0" x2="100" y2="100" stroke-width="1" stroke="black"/>
                    </svg>
                </div><div> {dislike} </div>
                <div>Report: {report}</div>
            </IconDiv>
            <div></div>
        </div>


    )
}

const NeonList = ({ list }) => {
    return (
        <div>
            {list.map(item => (
                <NeonObj data={item} />
            ))}
        </div>
    )

}
const defaultData = [{ url: "", name: "", icon: "", like: 0, dislike: 0, report: 0 }];

export const Recommend = () => {
    let [text, setText] = useState("");
    let [rec, setRec] = useState(defaultData);

    const neonEffect = function () {
        text = !text ? "Neon Effect" : ""
        setText(text);
        fetch("/api/recommend/random").then(data => data.json()).then(res => {
            setRec(res);
            console.log([res])
        });
    }
    return (
        <div className="App" style={{ backgroundColor: "black" }}>
            <header className="App-header">
            </header>
            <div className="container">
                <div className="neon-btn" onClick={neonEffect}>Click Me</div>
                <div style={{ marginTop: "1em" }}>
                    {rec === defaultData ? null : <NeonList list={rec} />}
                </div>
            </div>
        </div>
    );
}

export default App;
