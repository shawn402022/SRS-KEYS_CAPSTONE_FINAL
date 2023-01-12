////////////////////////////////////////////////////////////////////////---WEB AUDO API

Window.AudioContext = window.AudioContext || window.webkitAudioContext
let ctx;

const Oscillator={}

const startButton = document.querySelector('button');
startButton.addEventListener('click', () => {
    ctx = new AudioContext();
    console.log(ctx)
})

// Make Midi Keyboard note value correspond to a musical note
function midiToFreq(number){
const a = 440;
return( a / 32 ) * (2 ** ((number - 9) / 12 ));
}






////////////////////////////////////////////////////////////////////////---MIDI TO BROWSER

if(navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(success, failure)
}

function success(midiAccess) {
    // midiAccess.onstatechange = updateDevices
    midiAccess.addEventListener('statechange', updateDevices)

    const inputs = midiAccess.inputs

    inputs.forEach((input) => {
        // input.onmidimessage = handleInput
        input.addEventListener('midimessage', handleInput)
    })    
}



function handleInput(input) {
    const command = input.data[0];
    const note = input.data[1];
    const velocity = input.data[2];
    
    switch(command) {
        case 144: // notOn
        if (velocity > 0) {
            noteOn(note, velocity);
        } else {
            noteOff(note);
        }
        break;
        case 128: //note off
        noteOff(note);
            break;
    }
}


function noteOn(note, velocity) {
    console.log(note, velocity)
    const osc = ctx.createOscillator();
    // volume and gain
    const oscGain = ctx.createGain()
    oscGain.gain.value = 0.33

    
    osc.type = 'saw';
    osc.frequency.value = midiToFreq(note);
    osc.connect(oscGain)
    oscGain.connect(ctx.destination);
    console.log(osc)
    console.log(oscGain)
    osc.start();
}

function noteOff(note) {
    console.log(note);
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

                if (naturalName === noteName || sharpName === noteName || flatName === noteName) {
                    key.classList.add("show");
                }
            })
        })
        console.log(pianoKeys)
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

app.setupPiano()
app.displayNotes()
// console.log(app.getNaturalNotes(range))