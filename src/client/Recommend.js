import './App.css';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: "AIzaSyD68VVTgiVceafaNB-Brrp-I9-_xiTLEBo",
    authDomain: "vandyhack2023.firebaseapp.com",
    projectId: "vandyhack2023",
    storageBucket: "vandyhack2023.appspot.com",
    messagingSenderId: "700079134322",
    appId: "1:700079134322:web:81c95ff7175e428c2354eb"
};
import { Input , InputGroup, InputLeftElement, Spinner} from '@chakra-ui/react'
import { LinkIcon } from '@chakra-ui/icons';
import { getFirestore, collection, query, where, getCountFromServer, addDoc, updateDoc, increment, limit, getDocs, orderBy } from "firebase/firestore";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const IconDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
`
const LineDiv = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-top: 0.5em;
    justify-content: space-between;
    width: 90%;
`


const urlPattern = /^((https?|ftp):\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})(:[0-9]+)?(\/\S*)?$/;

function isValidURL(url) {
  return urlPattern.test(url);
}


const NeonText = ({ text }) => {
    return (
        <div className="neon-text">
            {text}
        </div>
    )
}

function getValidUrl(url) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url; 
    } else {
        return `http://${url}`; 
    }
}


const NeonObj = ({ data }) => {
    const url = data.url;
    let name = "Random Site";
    if(data.name){name = data.name};
    name = (name.length <= 30) ? name: name.slice(0, 25) + '...';
    const icon = data.iconUrl;
    const like = data.like;
    const dislike = data.dislike;

    const validUrl = url?getValidUrl(url):"www.google.com";

    const likeUrl = async function () {
        const q = query(collection(db, "urls"), where("url", "==", url), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            let ref = querySnapshot.docs[0].ref;
            let ret = await updateDoc(ref, {
                like: increment(1)
            });
            
        } else {
            return "Not exist"
        }
    }

    const dislikeUrl = async function () {
        const q = query(collection(db, "urls"), where("url", "==", url), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            let ref = querySnapshot.docs[0].ref;
            let ret = await updateDoc(ref, {
                dislike: increment(1)
            });
            
        } else {
            return "Not exist"
        }
    }

    const reportUrl = async function () {
        const q = query(collection(db, "urls"), where("url", "==", url), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            let ref = querySnapshot.docs[0].ref;
            let ret = await updateDoc(ref, {
                report: increment(1)
            });
        } else {
            return "Not exist"
        }
    }

    return (
        <LineDiv className="neon-text-box">
            <div style={{ display: "flex", flexDirection: "row" }}>
                <img src={icon} style={{ width: "25px", height: "25px" }} />

                <div style={{ marginLeft: "0.5em",overflow:"hidden",maxWidth: "400px",  }}>
                    <NeonText text={name} />
                    <a href={validUrl} style={{ textDecoration: "none" }} target="_blank">Visit Site</a>
                </div>
            </div>
            <IconDiv>

                <svg className="heart" width="24" height="24" viewBox="0 0 24 24" fill="none" onClick={likeUrl} style={{ marginLeft: "0.2em" }}>
                    <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>

                <div style={{ marginLeft: "0.2em" }}>{like}</div>
                <svg width="24" height="24" viewBox="0 0 24 24" className="heart" onClick={dislikeUrl} style={{ marginLeft: "0.2em" }}>
                    <line x1="3" y1="20" x2="20" y2="3" stroke-width="2" />
                    <line x1="3" y1="3" x2="20" y2="20" stroke-width="2" />
                </svg>

                <div style={{ marginLeft: "0.2em" }}> {dislike} </div>
                <div className="neon-btn-sm" onClick={reportUrl} style={{ marginLeft: "0.3em" }}>Report</div>
            </IconDiv>
        </LineDiv>
    )
}

const NeonList = ({ list }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {list.map(item => (
                <NeonObj data={item} />
            ))}
        </div>
    )
}
const defaultData = [{ url: "", name: "", icon: "", like: 0, dislike: 0, report: 0 }];

export const Recommend = () => {
    const [inputVal, setInputVal] = useState('');
    const [mode, setMode] = useState('');
    const [processing, setProcessing] = useState(false)
    const [prevInput, setPrevInput] = useState('')


    const addUrl = function () {
        console.log(`inputVal: ${inputVal}`, ` prevInput: ${prevInput}`)
        if (inputVal === '' || !isValidURL(inputVal)) {
            setText("Please enter a valid URL");
            return;
        }else if (prevInput === inputVal) {
            setPrevInput(inputVal);
            setText("You already shared it!");
            return;
        }else{
        setPrevInput(inputVal);
        setProcessing(true);
        let url = inputVal;
        const q = query(collection(db, "urls"), where("url", "==", url), limit(1));
        getDocs(q).then((querySnapshot) => {
            if (querySnapshot.empty) {
                addDoc(collection(db, "urls"), {
                    dislike: 0,
                    iconUrl: `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=16`,
                    like: 0,
                    name: url,
                    report: 0,
                    url: url,
                    totalViewed: 0,
                }).then(() => {setText("Site Shared!")}).catch(err => { setProcessing(false); });
            } else {
                let ref = querySnapshot.docs[0].ref;
                updateDoc(ref, {
                    like: increment(1)
                }).then(() => {setText("Site exists, Liked!")}).catch(err => { setProcessing(false); });
            }
        }).catch(err => { setProcessing(false); })
        setProcessing(false);
        }
    }

    let [text, setText] = useState("");
    let [rec, setRec] = useState(defaultData);
    let [recR, setRecR] = useState(defaultData);

    useEffect(() => {
        // Create a variable to hold the interval ID
        let intervalId;
        if (mode === 'top') {
            intervalId = setInterval(() => {
                selectTop();
                console.log(`refresh ${mode}`);
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [mode]);

    const selectTop = function () {
        setMode("top");
        const urlsRef = collection(db, "urls");
        const q = query(urlsRef, orderBy("like", "desc"), limit(5));
        const ret = [];
        getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                ret.push({ url: doc.data().url, iconUrl: doc.data().iconUrl, like: doc.data().like, dislike: doc.data().dislike, name: doc.data().name })
            });
            setRec(ret)
        })
    }

    const selectRandom = async function () {
        setMode("random");
        const randomArray = [-1, -1, -1, -1, -1];

        if (collectionSize < randomArray.length) {
            return;
        }
        const coll = collection(db, "urls");
        const snapshot = await getCountFromServer(coll);
        const collectionSize = snapshot.data().count;

        let randomUrls = []
        let ret = []

        const q = query(coll, limit(collectionSize));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc, index) => {
            ret.push({ url: doc.data().url, iconUrl: doc.data().iconUrl, like: doc.data().like, dislike: doc.data().dislike, name: doc.data().name })
        });

        for (let i = 0; i < randomArray.length; ++i) {
            let randomIndex = Math.floor(Math.random() * collectionSize);
            while (randomArray.includes(randomIndex)) {
                randomIndex = Math.floor(Math.random() * collectionSize);
            }
            randomArray[i] = randomIndex
            randomUrls.push(ret[randomIndex])
        }
        setRecR(randomUrls)
    }


    const handleInputChange = (e) => {
        setText("");
        setInputVal(e.target.value);
    };

    return (
        <div className="App" style={{ backgroundColor: "black", marginBottom: "0.2em" }}>
            <header className="NeOff">
            </header>
            {processing ? <Spinner
                        position="absolute"
                        top="30%"
                        left="auto"
                        transform="translate(-50%, -50%)"
                        color='#e85ff5'
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        size='xl'
                        /> : null }

            <div className="container">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <h1 className="neon-text-flicker" style={{ marginTop: "0.5em", marginBottom: "0.2em", fontSize: "25px" }}>Share Site?</h1>
                    
                    <InputGroup>
                        <InputLeftElement
                            pointerEvents="none"
                            children={<LinkIcon color="gray.300" boxSize="3" />}
                        />
                        <Input placeholder="Enter URL" onChange={(e) => handleInputChange(e)} w='50'/>
                    </InputGroup>
                    <h1 className="neon-text-flicker" style={{ marginTop: "0.5em", marginBottom: "0.2em", fontSize: "20px" }}>{text}</h1>

                    <div className="neon-btn" onClick={addUrl} style={{ marginTop: "0.2em", fontSize: "15px" }}>
                        <NeonText text="Add Site" />
                    </div>
                </div>
                <hr className="divider" />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div className="neon-btn" onClick={selectRandom} style={{ marginTop: "0.2em" }}>
                        <NeonText text="Random Site" />
                    </div>
                    <div className="neon-btn" onClick={selectTop} style={{ marginTop: "0.5em" }}>
                        <NeonText text="Top Site" />
                    </div>
                </div>
                <div style={{ marginTop: "0.5em" }}>
                    {(rec !== defaultData && mode === "top") ? <NeonList list={rec} /> : (recR != defaultData && mode === "random") ? <NeonList list={recR} /> : null}
                </div>
            </div>
        </div>
    );
}

export default App;
