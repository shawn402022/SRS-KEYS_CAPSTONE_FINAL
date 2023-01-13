<<<<<<<< HEAD:srsKEYS.js
// import { Midi } from "tonal";
========
////////////////////////////////////////////////////////////////////////---PACKAGE IMPORTS

// import{note, interval, } from "@tonaljs/tonal";
// import { Note } from "tonal";
// import{chord} from "@tonaljs/chord";
// import { detect } from "@tonaljs/chord-detect";
// import { entries}  from "@tonaljs/chord-dictionary";
// import { Midi } from "tonal";
import { Howler, howl, Howl } from 'howler';

////////////////////////////////////////////////////////////////////////--HOWLER/JS
const sound = new Howl({
    src:['assets/PIANOsprite.mp3'],
    onload() {
        console.log('sound file has been loaded')
        soundEngine.init();
    },
    onloaderror(e, msg) {
        console.log('Error', e, msg)
    }
})

const soundEngine = {
    init() {
        // This makes individial notes(sprites) of a longer audio file
        const lengthOfNote = 516; // each sprite is 516 ms long
        let timeIndex = 0;
        for(let i = 24; i <= 96; i++) {
            sound['_sprite'][i] = [timeIndex, lengthOfNote];
            timeIndex += lengthOfNote;
        }
        sound.play('26');
        console.log('should be playing')
    }
}




////////////////////////////////////////////////////////////////////////---TONAL/JS

const startNotes = ['C','C#','Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A#', 'Bb', 'B']
// const { Note } = require("tonal");
// const { Midi } = require("tonal");
// const { Chord } = require("tonal");





>>>>>>>> 7b6998b6f14c195bfa1eb51591955eb2879161f4:src/app.js



////////////////////////////////////////////////////////////////////////---WEB AUDO API

Window.AudioContext = window.AudioContext || window.webkitAudioContext
let ctx;
const startButton = document.querySelector('button');

// oscilator will be an object and hold the midi values, also tokeep track of whats playing 
const oscillators={}
startButton.addEventListener('click', () => {
    ctx = new AudioContext();
    
    startAlgo()
  
    
})

// Make Midi Keyboard note value correspond to a musical note
function midiToFreq(number){
const a = 440;
console.log(number)
return( a / 32 ) * (2 ** ((number - 9) / 12 ));
}






////////////////////////////////////////////////////////////////////////---WEB MIDI API

if(navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(success, failure)
}

function success(midiAccess) {
    // midiAccess.onstatechange = updateDevices
    midiAccess.addEventListener('statechange', updateDevices)

    const inputs = midiAccess.inputs
    const outputs = midiAccess.outputs
    // console.log(outputs)

    inputs.forEach((input) => {
        // input.onmidimessage = handleInput
        input.addEventListener('midimessage',  handleInput)
        // input.addEventListener('midimessage', ()=> console.log(input))   
    })    
}

    // This Object is used to to match midi notes(key) to actual piano note values
    const midiNote = {
        84:"C6", 
        83:"B5", 82:"Bb5", 81:"A5", 80:"Ab5", 79:"G5", 78:"Gb5", 77:"F5", 76:"E5", 75:"Eb5", 74:"D5", 73:"Db5", 72:"C5",
        71:"B4", 70:"Bb4", 69:"A4", 68:"Ab4", 67:"G4", 66:"Gb4", 65:"F4", 64:"E4", 63:"Eb4", 62:"D4", 61:"Db4", 60:"C4",
        59:"B3", 58:"Bb3", 57:"A3", 56:"Ab3", 55:"G3", 54:"Gb3", 53:"F3", 52:"E3", 51:"Eb3", 50:"D3", 49:"Db3", 48:"C3",
        47:"B2", 46:"Bb2", 45:"A2", 44:"Ab2", 43:"G2", 42:"Gb2", 41:"F2", 40:"E2", 39:"Eb2", 38:"D2", 37:"Db2", 36:"C2",
        
    }
    const correctNotesC = { 84:"C6", 72:"C5", 60:"C4", 48:"C3", 36:"C2",}
    const correctNotesD = { 74:"D5", 62:"D4", 50:"D3", 38:"D2",}
    const correctNotesE = { 76:"E5", 64:"E4", 52:"E3", 40:"E2",}
    const correctNotesF = { 77:"F5", 65:"F4", 53:"F3", 41:"F2",}
    const correctNotesG = { 79:"G5", 67:"G4", 55:"G3", 43:"G2",}
    const correctNotesA = { 81:"A5", 69:"A4", 57:"A3", 45:"A2",}
    const correctNotesB = { 83:"B5", 71:"B4", 59:"B3", 47:"B2",}


function startAlgo() {
    const qBot = document.getElementById(qGroupNotes)
    console.log('questions123')
    
    
    qBot.innerHTML =` <p>What Note is C?</p>`
    

}



function handleInput(input) {
    console.log("test")
    console.log(input)
    const command = input.data[0];
    const note = input.data[1];
    console.log(note)
    const velocity = input.data[2];


    console.log(oscillators)
    app.displayNotes([midiNote[note]])
    switch(command) {
        case 144: // notOn
        if (velocity > 0) {
            noteOn(note, velocity);
            console.log(test)
        } else {
            noteOff(note);
        }
        break;
        case 128: //note off
        noteOff(note);
        console.log(note)
        
            break;
    }
}


function noteOn(note, velocity) {
const osc = ctx.createOscillator();
console.log(osc, 'osc')
console.log(oscillators, 'oscillators')

    // volume and gain
    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.33;

    const velocityGainAmount = (1 /127) * velocity;
    const velocityGain = ctx.createGain();

    velocityGain.gain.value = velocityGainAmount ;   

    osc.type = 'saw';
    osc.frequency.value = midiToFreq(note);

    osc.connect(oscGain);
    oscGain.connect(velocityGain);
    velocityGain.connect(ctx.destination);

    osc.gain = oscGain; 
    
    oscillators[note.toString()] = osc;
    // console.log(oscillators)
    osc.start();
}

// when you let go of the key it send a note off message so the sound can stop
function noteOff(note) {
    const osc = oscillators[note.toString()];
    const oscGain = osc.gain;
    
    oscGain.gain.setValueAtTime(oscGain.gain.value, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

    setTimeout(() => {
        osc.stop();
        osc.disconnect();
    }, 20 )
    

    delete oscillators[note.toString()];
    console.log(oscillators);
    // console.log(note);
}

function updateDevices(event) { 
    console.log('Name: ${event.port.name}, Brand: ${event.port.manufacturer}, State, ${event.port.state}, Type: ${event.port.type}')
}

function failure() {
    console.log('could not run');
}



////////////////////////////////////////////////////////////////////////---SVG PIANO




const whiteKeyWidth = 80
const pianoHeight = 400

const naturalNotes= ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const naturalNotesSharps= ['C', 'D', 'F', 'G', 'A',]
const naturalNotesFlats= ['D', 'E', 'G', 'A', 'B']
const range = ['C2','C6']


const app ={
    setupPiano() {
        const piano = document.querySelector("#piano")
        const allNaturalNotes = this.getNaturalNotes(range)
        const pianoWidth = allNaturalNotes.length * whiteKeyWidth
        const SVG = this.createMainSVG(pianoWidth, pianoHeight)


        //add white keys
        let whiteKeyPositionX = 0
        allNaturalNotes.forEach((noteName) => {
            const whiteKeyTextGroup = utils.createSVGElement("g")
            const whiteKey = this.createKey({className: "white-key", width: whiteKeyWidth, height: pianoHeight})
            const text = utils.createSVGElement("text")

            utils.addTextContent(text, noteName)
            utils.setAttributes(whiteKeyTextGroup, {"width": whiteKeyWidth})
            utils.setAttributes(text, {
                "x":whiteKeyPositionX + whiteKeyWidth /2,
                "y": 380,
                "text-anchor" : "middle"
            })

            utils.setAttributes(whiteKey, {
                "x": whiteKeyPositionX,
                "data-note-name": noteName,
                "rx":20,
                "ry":20
            })

            text.classList.add("white-key-text")
            whiteKeyTextGroup.appendChild(whiteKey)
            whiteKeyTextGroup.appendChild(text)
            SVG.appendChild(whiteKeyTextGroup)


            // increment spacing 
            whiteKeyPositionX += whiteKeyWidth 
        })
   


        // add black keys
        let blackKeyPositionX = 60
        allNaturalNotes.forEach((naturalNotes, index, array) => {
            //  if last iteration of keys, do not add black key
            if (index === array.length -1) {
                return
            }
            // naturalNotes.addEventListener('click', console.log(test))
            
            const blackKeyTextGroup = utils.createSVGElement("g")
            const blackKey = this.createKey( {className : "black-key", width : whiteKeyWidth / 2, height: pianoHeight/ 1.6   })
            const flatNameText = utils.createSVGElement("text")
            const sharpNameText = utils.createSVGElement("text")

            utils.setAttributes(blackKeyTextGroup, {"width": whiteKeyWidth /2})

            for(let i =  0; i< naturalNotesSharps.length; i++) {
                let naturalSharpNoteName = naturalNotesSharps[i]
                let naturalFlatNoteName = naturalNotesFlats[i]
                if (naturalSharpNoteName === naturalNotes[0]) {

                    utils.setAttributes(blackKey, {
                        "x": blackKeyPositionX,
                        "data-sharp-name": `${ naturalSharpNoteName}#${ naturalNotes[1]}`,
                        "data-flat-name": `${ naturalFlatNoteName}b${ naturalNotes[1]}`,
                        "rx":8,
                        "ry":8
                    })

                    utils.setAttributes(sharpNameText, {
                        "text-anchor": "middle",
                        'y': 215,
                        "x": blackKeyPositionX + (whiteKeyWidth / 4)
                    })

                    utils.setAttributes(flatNameText, {
                        "text-anchor": "middle",
                        'y': 235,
                        "x": blackKeyPositionX + (whiteKeyWidth / 4)
                    })

                    utils.addTextContent(sharpNameText, `${naturalSharpNoteName}#`)
                    utils.addTextContent(flatNameText, `${naturalFlatNoteName}b`)
                    
                    flatNameText.classList.add("black-key-text")
                    sharpNameText.classList.add("black-key-text")


                    // add double spaces between D# AND A#
                    if(naturalSharpNoteName === "D" || naturalSharpNoteName === "A") {
                        blackKeyPositionX += whiteKeyWidth * 2 
                    } else {
                        blackKeyPositionX += whiteKeyWidth
                    }

                    blackKeyTextGroup.appendChild(blackKey);
                    blackKeyTextGroup.appendChild(flatNameText);
                    blackKeyTextGroup.appendChild(sharpNameText);
                }

                SVG.appendChild(blackKeyTextGroup)
            }
        })



         //  Add main SVG to piano div
         piano.appendChild(SVG)
    },

    createOctave(octNum) {
         // create a group element with a class of octive, just like in html
         const octave = utils.createSVGElement("g")
         octave.classList.add("octave")

         // Moves the new octives that are created
         octave.setAttribute("transform", `translate(${ octNum * octWidth }, 0)`)
         return octave
    },

    createKey({className, width, height}) {
        const key = utils.createSVGElement("rect")
        key.classList.add(className, "key")
        utils.setAttributes(key, {
            "width": width,
            "height": height
        })
        return key

    },
    getNaturalNotes([firstNote, lastNote]) {

        // Assingn octave number, notes and positoins to variables
        const firstNoteName = firstNote[0]
        const firstOctaveNumber = parseInt(firstNote[1])  
        const lastNoteName = lastNote[0]
        const lastOctaveNumber = parseInt(lastNote[1])
        const firstNotePosition = naturalNotes.indexOf(firstNoteName)
        const lastNotePosition = naturalNotes.indexOf(lastNoteName)
        const allNaturalNotes = []

        for( let octaveNumber = firstOctaveNumber; octaveNumber <= lastOctaveNumber; octaveNumber++){
            // first octave
            if(octaveNumber === firstOctaveNumber) {
                naturalNotes.slice(firstNotePosition).forEach((noteName) => {
                    allNaturalNotes.push(noteName + octaveNumber)
                }) 
                


                // last octave
            } else if (octaveNumber === lastOctaveNumber) {
                // start at the beginning of array then go to the last position but add 1 so  it ands at "a" instead of 'g'
                naturalNotes.slice(0, lastNotePosition + 1).forEach((noteName) => {
                    allNaturalNotes.push(noteName + octaveNumber)
                })
            } else {
                naturalNotes.forEach((noteName) => {
                    allNaturalNotes.push(noteName + octaveNumber)
                })
            }
        }
        return allNaturalNotes
    },

    createMainSVG(pianoWidth, pianoHeight) {
        const svg = utils.createSVGElement("svg")

        utils.setAttributes(svg, {
            "width": "100%",
            "version": "1.1",
            "xmlns":"http://www.w3.org/2000/svg",
            "mlns:xlink": "http://www.w3.org/199/xlink",
            "viewBox": `0 0 ${pianoWidth} ${pianoHeight}`
        })
        return svg

    },

    displayNotes(notes) {
        const pianoKeys = document.querySelectorAll(".key")
        utils.removeClassFromNodeCollection(pianoKeys, "show")

        // pianoKeys.addEventListener(midiAccess)

        notes.forEach(noteName => {
            pianoKeys.forEach(key => {
                const naturalName = key.dataset.noteName;
                const sharpName = key.dataset.sharpName;
                const flatName = key.dataset.flatName;
                    // makes the keys light up 
                if (naturalName === noteName || sharpName === noteName || flatName === noteName) {
                    key.classList.add("show");
                }
            })
        })
        // console.log(pianoKeys)
    }  
}

const utils = {
    createSVGElement(el) {
        const element = document.createElementNS("http://www.w3.org/2000/svg", el)
        return element
    },

    setAttributes(el, attrs) {
        for( let key in attrs) {
            el.setAttribute(key, attrs[key])
        }
    },
    
    addTextContent(el, content) {
        el.textContent = content
    },

    removeClassFromNodeCollection(nodeCollection, classToRemove)  {
        nodeCollection.forEach(node => {
            if (node.classList.contains(classToRemove)) {
                node.classList.remove(classToRemove)
            }
        })
    }    
}

<<<<<<<< HEAD:srsKEYS.js
app.setupPiano()
app.displayNotes()
// const midiNote = {
//     60:"C4"
// }
// console.log(app.getNaturalNotes(range))


// const kontrol = MIDIAccess.inputs
// console.log(kontrol)
========
// app.setupPiano()
// app.displayNotes()
// console.log(app.getNaturalNotes(range))
>>>>>>>> 7b6998b6f14c195bfa1eb51591955eb2879161f4:src/app.js
