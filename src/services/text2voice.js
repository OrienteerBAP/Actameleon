import { ref } from "vue";

const available = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

let wakeLock = null;

let speaking = ref(false);

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

const readIt = (script) => {
    if(!available) return;

    if(speaking.value) {
        speechSynthesis.cancel();
        speaking.value = false;
        return;
    } else {
        let textToRead = script.acts.flatMap(act => act.scenes.flatMap(scene => scene.lines.map(line => line.text)).join(' '));
        textToRead = script.acts
        .filter(act => act.active)
        .flatMap(act => act.scenes)
        .filter(scene => scene.active)
        .flatMap(scene => scene.lines)
        .filter(line => line.state === 'show' || line.state === 'clue')
        .map(line => line.text)
        .join(' ');

        requestWakeLock();

        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = script.language ? script.language : 'ru';
        utterance.onstart = () => speaking.value = true;
        utterance.onend = () => {
        speaking.value = false;
        releaseWakeLock();
        };
        speechSynthesis.speak(utterance);
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
    readIt,
    cancel
}