import React from 'react'
import { useEffect, useState, useRef } from 'react';

const VideoPlayer = () => {
    const [subtitles, setSubtitles] = useState([]);
    const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(-1);
    const videoRef = useRef(null);

    // 解析SRT字幕文件
    useEffect(() => {
        fetch('https://box.hdcxb.net/d/%E6%85%A7%E7%81%AF%E7%A6%85%E4%BF%AE/%E6%85%A7%E7%81%AF%E7%A6%85%E4%BF%AE%E8%AF%BE/%E6%85%A7%E7%81%AF%E7%A6%85%E4%BF%AE%E8%AF%BE%E7%AC%AC%E4%B8%80%E5%86%8C/02-2%20%E4%B8%89%E6%AE%8A%E8%83%9C%EF%BC%88%E4%B8%AD%EF%BC%89.srt')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                parseSRT(data);
            })
        // 辅助函数：将srt文件解析成数组
        const parseSRT = (data) => {
            const subtitlesArray = [];
            const subtitleLines = data.trim().split('\n\n');
            subtitleLines.forEach((line) => {
                const parts = line.trim().split('\n');
                const index = parts[0];
                const time = parts[1].split(' --> ');
                const text = parts.slice(2).join('\n');
                subtitlesArray.push({ index, startTime: time[0], endTime: time[1], text });
            });
            setSubtitles(subtitlesArray);
        };
    }, []);

    // 监听视频时间更新事件
    useEffect(() => {
        const video = videoRef.current;
        const handleTimeUpdate = () => {
            const currentTime = video.currentTime;
            const currentSubtitleIndex = subtitles.findIndex(subtitle =>
                currentTime >= parseTime(subtitle.startTime) && currentTime <= parseTime(subtitle.endTime)
            );
            if (currentSubtitleIndex !== -1) {
                setCurrentSubtitleIndex(currentSubtitleIndex);
                scrollSubtitleToView(currentSubtitleIndex);
            }
        };
        video.addEventListener('timeupdate', handleTimeUpdate);
        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [subtitles]);

    // 辅助函数：将时间格式转换为秒数
    const parseTime = (timeString) => {
        const parts = timeString.split(':');
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseFloat(parts[2].replace(',', '.'));
        return hours * 3600 + minutes * 60 + seconds;
    };

    return (
        <div className="flex">
            <div className="w-2/4">
                <video ref={videoRef} controls>
                    <source src="https://box.hdcxb.net/d/%E6%85%A7%E7%81%AF%E7%A6%85%E4%BF%AE/%E6%85%A7%E7%81%AF%E7%A6%85%E4%BF%AE%E8%AF%BE/%E6%85%A7%E7%81%AF%E7%A6%85%E4%BF%AE%E8%AF%BE%E7%AC%AC%E4%B8%80%E5%86%8C/02-2%20%E4%B8%89%E6%AE%8A%E8%83%9C%EF%BC%88%E4%B8%AD%EF%BC%89.mp4" type="video/mp4" />
                </video>
            </div>
            <ul className="mx-5 my-2 subtitles-box overflow-y-scroll h-80">
                {subtitles.map((subtitle, index) => (
                    <li
                        onClick={()=>videoRef.current.currentTime = parseTime(subtitle.startTime)}
                        key={index}
                        id={`subtitle-${index}`}
                        className={`subtitle-line cursor-pointer`}
                    >
                        <span className='p-1 font-thin text-xs'>{subtitle.startTime.split(',')[0]}</span>
                        <span className={`hover:text-blue-400 ${index === currentSubtitleIndex && 'text-blue-400 text-lg'}`}>{subtitle.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const scrollSubtitleToView = (index) => {
    const subtitleElement = document.getElementById(`subtitle-${index}`);
    if (subtitleElement) {
        subtitleElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
        });
    }
};

export default function SubtitlePlayer() {
    return (
        <div><VideoPlayer /></div>
    )
}
