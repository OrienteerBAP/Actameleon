import { ref } from "vue";

const available = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

let wakeLock = null;

let speaking = ref(false);


let linesToSpeak = [];
let language = 'ru';

const requestWakeLock = async () => {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => {
        console.log('Wake lock was released');
        });
        console.log('Wake lock is active');
    } catch (err) {
        console.error(`${err.name}, ${err.message}`);
    }
};
  
const releaseWakeLock = () => {
    if (wakeLock !== null) {
        wakeLock.release();
        wakeLock = null;
    }
};

const toggleReading = (script) => {
    if(!available) return;
    if(speaking.value) {
        cancel();
    } else {
        read(script);
    }
}


const speakNext = () => {
    const line = linesToSpeak.shift();
    if(typeof line === 'undefined' || !speaking.value) {
        releaseWakeLock();
        speaking.value = false;
    } else {
        const utterance = new SpeechSynthesisUtterance(line.text);
        utterance.lang = language;
        utterance.onstart = () => {
            line.selected = true;
        }
        utterance.onend = () => {
            line.selected = false;
            speakNext();
        }
        utterance.onerror = () => {
            line.selected = false;
        }
        speechSynthesis.speak(utterance);
        if(!speaking.value) speaking.value = true;
    }
}

const read = (script) => {
    if(available) {
        linesToSpeak = script.acts
        .filter(act => act.active)
        .flatMap(act => act.scenes)
        .filter(scene => scene.active)
        .flatMap(scene => scene.lines)
        .filter(line => line.state === 'show' || line.state === 'clue');
        language = script.language ? script.language : 'ru';
        speaking.value = true;
        requestWakeLock();
        speakNext();
    }
};

const cancel = () => {
    if(available) {
        speechSynthesis.cancel();
        speaking.value = false;
        releaseWakeLock();
    }
};


export default {
    available,
    speaking,
    toggleReading,
    read,
    cancel
}