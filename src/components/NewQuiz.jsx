import React,{ useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { socket } from './EnterCodeForm'
import ReactDOM from 'react-dom'
import '../style/NewQuizStyle.css'

import { Chip, TextField, Button, Typography, Divider } from '@material-ui/core';

import firebase from "firebase"
import "firebase/database";
import { toast } from 'react-toastify'
import { AddCircleRounded, DeleteRounded } from '@material-ui/icons'
import UploadButton from './UploadButton'

export default function NewQuiz() {

    const [question, setQuestion] = useState(0)
    const [questionArray, setQuestionArray] = useState([1,2,3,4,5,6])

    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');
    const [tagNumber, setTagNumber] = useState(0);


    const quizObj = {}

    useEffect(() => {
        toast.info("Please make sure each answer is different or the quiz will not work!")
    }, [])

    const Submit = () => {
        for(var i = 0; i < document.getElementsByClassName('userInput').length; i++){
            console.log('userIn')
            if(document.getElementsByClassName('userInput')[i].value == ""){
                toast.error('A field has been left empty!')
                return
            }
        }
        firebase.database().ref(`quizes/`).push(quizObj)
        toast.success('Quiz Created!')
        for(var i = 0; i < document.getElementsByClassName('userInput').length; i++){
            document.getElementsByClassName('userInput')[i].value = ""
        }

        
    }
    const getTags = () => {
        const newTagArr = []
        tags.map((tag) => {
            newTagArr.push(tag)
        })
        return newTagArr
    }

    const setQuizObj = () => {
        console.log(document.getElementsByClassName('questions'))

        quizObj.name = document.getElementById('quizName').value
        quizObj.userName = JSON.parse(localStorage.getItem('user')).profileObj.name
        quizObj.userProfilePic = JSON.parse(localStorage.getItem('user')).profileObj.imageUrl
        quizObj.userID = JSON.parse(localStorage.getItem('user')).profileObj.googleId
        quizObj.coverImg = document.getElementById('coverImg').src
        quizObj.tags = getTags()

        for(var i = 0; i < document.getElementsByClassName('questions').length; i++){
            console.log(document.getElementsByClassName('questions')[i].value + ' ' +  document.getElementsByClassName('questions')[i].value)
            quizObj[`q${i}`] = {
                question: document.getElementsByClassName('questions')[i].value,
                answer: document.getElementsByClassName('answers')[i].value
            } 
        }

        console.log(quizObj)
        Submit()
    }

    const Card = ({questionNumber}) => (
        <div className='card2' id={`question${questionNumber}card`}>
            <h1>Question {questionNumber}</h1>
            <input className='questions userInput' id={`question${questionNumber}`} type='text' placeholder={'Question'}/>
            <br></br><input className='answers userInput' id={`answer${questionNumber}`} type='text' placeholder={'Answer'} />
        </div>
    )

    const AddQuestion = () => {
        setQuestion(question + 1)
        setQuestionArray( [...questionArray, question])
    }

    const AddTag = (tag) => {
        if(tag === '') return
        if(tagNumber >= 5) return
        setTags([...tags, tag])
        setCurrentTag('')
        setTagNumber(tagNumber+1)
    }

    const handleDelete = (id, name) => {
        const newTags = []
        tags.map((tag) => {
            newTags.push(tag)
        })
        newTags.splice(name, 1)
        setTags(newTags)
        setTagNumber(newTags.length)

    };

    return (
        <div style={{marginTop:'100px'}}>
            <div style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
                <div>
                    <input className='userInput' id={'quizName'} type='text' placeholder="Give your quiz a cool name"></input>
                </div>
                <div>
                    <UploadButton/>
                </div>
                <div style={{backgroundColor:'white', padding:'15px', border:'2px solid black', boxShadow:'10px 10px 0 #262626'}}>
                    <Typography variant="h3">Tags</Typography>
                    <br></br>
                    <Divider light/>
                    <br></br>
                    <TextField variant="outlined" size='small' label="Tag Name" helperText={<span style={{color:'black'}}>{5-tagNumber} tags Left</span>} onChange={(e)=>{setCurrentTag(e.target.value)}} value={currentTag}/>
                    <Button variant="contained" size='medium' color="primary" onClick={()=>{AddTag(currentTag)}}>Add Tag</Button>
                    <br></br>
                    {
                        tags.map((tag, index) => (
                            <Chip style={{marginTop:'10px'}} key={tag+index} id={tag+index} label={tag} onDelete={()=>handleDelete(tag+index, tag)} color="primary" />
                        ))
                    }
                </div>
                <div className='cardContainer2' style={{margin:'1%'}}>
                    {
                        questionArray.map((question, i) => (
                            <Card key={i} questionNumber={i+1}/>
                        ))
                    }
                    <div onClick={()=>{AddQuestion()}} className='card2-2' style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <AddCircleRounded style={{width:'75px', height:'75px'}} color='primary'/>
                    </div>
                </div>
                <div>
                    <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='large' onClick={()=>{setQuizObj()}}>Submit</Button>
                </div>
            </div>
        </div>
    )
}
