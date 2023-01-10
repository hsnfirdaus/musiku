import { useEffect, useMemo, useRef, useState } from "react";
import { getSingleFile } from "../Helper/db";
import { MusicModel } from "../Model/music";
import DBContext from "./DBContext";

interface Props {
	children?: React.ReactNode;
}
const DBProvider: React.FC<Props> = ({ children }) => {
	const [DB, setDB] = useState<IDBDatabase>();
	const [currentPlayIndex, setCurrentPlayIndex] = useState<number>();
	const [isPaused, setIsPaused] = useState<boolean>(true);
	const [duration, setDuration] = useState<number>(0);
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [currentPictureUrl, setCurrentPictureUrl] = useState<string>();
	const [musicList, setMusicList] = useState<MusicModel[]>([]);
	const audioRef = useRef<HTMLAudioElement>();

	const currentMusic = useMemo(() => {
		if (currentPlayIndex !== undefined && musicList) {
			let find = musicList.find((_, idx) => idx === currentPlayIndex);
			return find ?? undefined;
		}
		return undefined;
	}, [musicList, currentPlayIndex]);

	useEffect(() => {
		if (currentPlayIndex !== undefined) {
			(async () => {
				if (!DB) return alert("DB Not loaded yet!");

				let music = musicList[currentPlayIndex];
				if (!music) return alert("Music not available!");
				if (music.pictureFileId) {
					getSingleFile(DB, music.pictureFileId).then((blob) => {
						let url = URL.createObjectURL(blob);
						setCurrentPictureUrl(url);
					});
				} else {
					setCurrentPictureUrl(undefined);
				}
				let musicFile = await getSingleFile(DB, music.fileFileId);
				let musicUrl = URL.createObjectURL(musicFile);
				if (audioRef.current) {
					audioRef.current.pause();
					audioRef.current.currentTime = 0;
					audioRef.current.src = musicUrl;
					audioRef.current.onended = () => onNext();
					audioRef.current.play();
				} else {
					let audio = new Audio(musicUrl);
					audio.onplay = () => setIsPaused(false);
					audio.onpause = () => setIsPaused(true);
					audio.ondurationchange = () => setDuration(audio.duration);
					audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
					audio.onended = () => onNext();
					audioRef.current = audio;
					audio.play();
				}
			})();
		}
	}, [currentPlayIndex]);

	useEffect(() => {
		if (!("indexedDB" in window)) {
			alert("This browser doesn't support IndexedDB");
			return;
		}
		let openDB = indexedDB.open("musiku", 1);
		openDB.onupgradeneeded = (event) => {
			let res = openDB.result;
			if (!res.objectStoreNames.contains("musics")) {
				res.createObjectStore("musics", { keyPath: "musicId", autoIncrement: true });
			}
			if (!res.objectStoreNames.contains("files")) {
				res.createObjectStore("files", { keyPath: "fileId", autoIncrement: true });
			}
		};
		openDB.onsuccess = () => {
			setDB(openDB.result);
		};
	}, []);

	const handlePlay = async (index: number) => {
		if (!DB) return alert("DB Not loaded yet!");
		if (index === currentPlayIndex && audioRef.current) {
			audioRef.current?.play();
		} else {
			setCurrentPlayIndex(index);
		}
	};

	const pause = () => {
		audioRef.current?.pause();
	};
	const play = () => {
		audioRef.current?.play();
	};
	const onSeek = (time: number) => {
		if (audioRef.current) {
			audioRef.current.currentTime = time;
		}
	};

	const onPrev = () => {
		if (currentPlayIndex === undefined) return;

		if (currentPlayIndex === 0) {
			handlePlay(musicList.length - 1);
		} else {
			handlePlay(currentPlayIndex - 1);
		}
	};

	const onNext = () => {
		if (currentPlayIndex === undefined) return;

		if (currentPlayIndex === musicList.length - 1) {
			handlePlay(0);
		} else {
			handlePlay(currentPlayIndex + 1);
		}
	};

	return (
		<DBContext.Provider
			value={{
				DB,
				setDB,
				musicList,
				setMusicList,
				handlePlay,
				pause,
				isPaused,
				play,
				currentPlayIndex,
				currentMusic,
				duration,
				currentTime,
				currentPictureUrl,
				onSeek,
				onPrev,
				onNext,
			}}
		>
			{DB ? children : <></>}
		</DBContext.Provider>
	);
};
export default DBProvider;
