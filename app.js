let numOfOct = 5;
const octWidth = 560;

const whiteKeyWidth = 80
const pianoHeight = 400

const naturalNotes= ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const range = ['F3','A7']

const pianoSVG = 
`
    <svg
        width="100%"
        viewBox= "0 0 ${numOfOct * octWidth } 400"
        version='1.1'
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink= "http://www.w3.org/1999/xlink"
        >
        <g id ="piano-keyboard">
        </g>
    </svg>
`;

const piano = document.querySelector("#piano");

const app ={
    setupPiano() {
        const allNaturalNotes = this.getNaturalNotes(range)
        //  Add main SVG to piano div
        piano.innerHTML = pianoSVG
        const pianoKeyboard = document.querySelector("#piano-keyboard")

        //  Creating octaves
        for (let i = 0; i < numOfOct; i++) {
            const octave = this.createOctave(i)
            
            let whiteKeyXPosition = 0
            let blackKeyXPosition = 60
            // add white keys to octave
            for (let i = 0; i < 7; i++) {
                const whiteKey = this.createKey({ className: "white-key", width:whiteKeyWidth, height:400})
                whiteKey.setAttribute("x", whiteKeyXPosition)
                whiteKeyXPosition += whiteKeyWidth
                octave.appendChild(whiteKey)
            }
            // add black keys to octave
            for (let i = 0; i < 5; i++) {
                const blackKey = this.createKey({ className: "black-key", width:whiteKeyWidth / 2, height:250})
                blackKey.setAttribute("x", blackKeyXPosition)
                if (i === 1) {
                    blackKeyXPosition += whiteKeyWidth * 2 
                } else{
                    blackKeyXPosition += whiteKeyWidth
                }
                octave.appendChild(blackKey)
            }

            // add to DOM
            pianoKeyboard.appendChild(octave)
        }
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
        key.classList.add(className)
        key.setAttribute("width", width)
        key.setAttribute("height", height)
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
    }
    
}

const utils = {
    createSVGElement(el) {
        const element = document.createElementNS("http://www.w3.org/2000/svg", el)
        return element

    },
       
}
app.setupPiano()
console.log(app.getNaturalNotes(range))