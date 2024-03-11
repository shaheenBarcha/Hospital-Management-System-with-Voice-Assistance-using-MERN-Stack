import React, { useState } from 'react';
import './V.css';

const Vassistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [voiceNote, setVoiceNote] = useState(null);
    const [savedTranscriptions, setSavedTranscriptions] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');

    const recognition = new window.webkitSpeechRecognition();

    recognition.lang = 'en-US';

    recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage('');
    };

    recognition.onend = () => {
        setTimeout(() => {
            setIsListening(false);
            setStatusMessage('Microphone not responding. Please try again.');
        }, 500);
    };

    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Transcript:', transcript);
    
        const audioBlob = new Blob([event.results[0][0].blob], { type: 'audio/wav' });
        console.log('Audio Blob:', audioBlob);
    
        const audioDataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(audioBlob);
        });
    
        console.log('Audio Data URL:', audioDataUrl);
    
        setTranscription(transcript);
        setVoiceNote(audioDataUrl);
    };
    

    const handleMicClick = () => {
        if (!isListening) {
            setIsListening(true);
            recognition.start();
            setStatusMessage('');
        } else {
            setIsListening(false);
            recognition.stop();
    
            if (transcription) {
                const audioBlob = new Blob([recognition.result[0].blob], { type: 'audio/wav' });
                setVoiceNote(audioBlob);
    
                setSavedTranscriptions([...savedTranscriptions, { transcription, voiceNote: audioBlob }]);
                setStatusMessage('Transcription and voice note saved successfully.');
            } else {
                setStatusMessage('No transcription to save.');
            }
        }
    };
    

    const handleClearClick = () => {
        setTranscription('');
        setVoiceNote(null);
        setStatusMessage('Transcription and voice note cleared.');
    };

    const handleSendClick = async () => {
        try {
            await fetch('http://localhost:5000/saveTranscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transcription }),
            });
            setStatusMessage('Transcription sent successfully.');
        } catch (error) {
            console.error('Error sending transcription:', error);
            setStatusMessage('Error sending transcription. Please try again.');
        }
    };

    return (
        <section className="vassistant-container">
            <div className="checkContainer">
                <div className="mic-container">
                    <div className="mic-icon" onClick={handleMicClick}>
                        {isListening ? '🗣️' : '🎙️'}
                    </div>
                </div>

                <div className="transcription-container">
                    <h3 className="h2-mulish">Need Help?</h3>
                    <br />
                    <h4 className="h3-mulish">Get Your Voice Assistance Here</h4>
                    <br />
                    <h5 className="h4-mulish">
                        Click and Speak, and You Will Get Every Access About Our App
                    </h5>
                    {transcription && (
                        <div className="transcription-text">{transcription}</div>
                    )}
                    {voiceNote && (
                        <audio controls>
                            <source src={voiceNote} type="audio/wav" />
                        </audio>
                    )}
                    {statusMessage && <div className="status-message">{statusMessage}</div>}
                    {transcription && (
                        <div className="icon-container">
                            <div className="send-icon" onClick={handleSendClick}>
                                📤
                            </div>
                            <div className="clear-icon" onClick={handleClearClick}>
                                🗑️
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Vassistant;
