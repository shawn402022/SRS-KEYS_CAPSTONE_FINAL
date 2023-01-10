let numOfOct = 3;
const octWidth = 560;

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

const octKeys = 
`
    // piano white keys
    <rect class="piano-key  white-key" x="0" y="0" width="80" height="400"></rect>
    <rect class="piano-key  white-key" x="80" y="0" width="80" height="400"></rect>
    <rect class="piano-key  white-key" x="160" y="0" width="80" height="400"></rect>
    <rect class="piano-key  white-key" x="240" y="0" width="80" height="400"></rect>
    <rect class="piano-key  white-key" x="320" y="0" width="80" height="400"></rect>
    <rect class="piano-key  white-key" x="400" y="0" width="80" height="400"></rect>
    <rect class="piano-key  white-key" x="480" y="0" width="80" height="400"></rect>
    // piano black keys
    <rect class="piano-key  black-key" x="60" y="0" width="40" height="250"></rect>
    <rect class="piano-key  black-key" x="140" y="0" width="40" height="250"></rect>
    <rect class="piano-key  black-key" x="300" y="0" width="40" height="250"></rect>
    <rect class="piano-key  black-key" x="380" y="0" width="40" height="250"></rect>
    <rect class="piano-key  black-key" x="460" y="0" width="40" height="250"></rect> 
`;

const piano =  document.querySelector("#piano");
piano.innerHTML = pianoSVG;
const pianoKeyboard = document.querySelector("#piano-keyboard");


// creating the octaves
for(let i = 0; i< numOfOct; i++) {
    // create a group element  with a class of ovtave just like in html-- also tell the browser were delign with svg
    const oct = document.createElementNS("http://www.w3.org./2000/svg","g");
    oct.classList.add("octave");
    // moves the octaves over
    oct.setAttribute("transform", `translate ( ${i * octWidth }, 0)`);
    // place the octaves inside of the octKeys variable
    oct.innerHTML = octKeys;
    pianoKeyboard.appendChild(oct)
}