import { createContext } from "react";
import { MusicModel } from "../Model/music";

interface DBContextValue {
	DB?: IDBDatabase;
	setDB?: React.Dispatch<React.SetStateAction<IDBDatabase | undefined>>;
	musicList: MusicModel[];
	setMusicList: React.Dispatch<React.SetStateAction<MusicModel[]>>;
	handlePlay: (index: number) => void;
	isPaused: boolean;
	pause: () => void;
	play: () => void;
	currentPlayIndex?: number;
	currentMusic?: MusicModel;
	duration: number;
	currentTime: number;
	currentPictureUrl?: string;
	onSeek: (time: number) => void;
	onPrev: () => void;
	onNext: () => void;
}
const DBContext = createContext<DBContextValue>({
	musicList: [],
	setMusicList: () => {},
	handlePlay: () => {},
	isPaused: false,
	pause: () => {},
	play: () => {},
	duration: 0,
	currentTime: 0,
	onSeek: () => {},
	onPrev: () => {},
	onNext: () => {},
});
export default DBContext;
