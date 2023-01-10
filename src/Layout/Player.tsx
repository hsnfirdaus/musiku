import { BackwardIcon, PlayIcon, ForwardIcon, PauseIcon } from "@heroicons/react/24/solid";
import { useContext } from "react";
import Progress from "../Component/Progress";
import DBContext from "../Context/DBContext";
import { durationFormat } from "../Helper/audio";

const Player: React.FC = () => {
	const {
		pause,
		currentMusic,
		isPaused,
		play,
		handlePlay,
		duration,
		currentTime,
		currentPictureUrl,
		onPrev,
		onNext,
		onSeek,
	} = useContext(DBContext);

	return (
		<div className="p-10 h-full text-center flex flex-col justify-center gap-4">
			<img
				src={currentPictureUrl ?? "/default.jpg"}
				className="aspect-square object-cover h-80 rounded-2xl mx-auto"
			/>
			<div className="my-5">
				<h1 className="font-bold text-4xl text-blue-900">{currentMusic?.title ?? "Tidak ada musik"}</h1>
				<h2 className="text-blue-500 text-md font-bold uppercase">{currentMusic?.artist ?? "-"}</h2>
			</div>
			<div className="my-5">
				<div className="flex gap-2">
					<div className="text-blue-400">{durationFormat(currentTime)}</div>
					<Progress
						min={0}
						max={duration}
						current={currentTime}
						onSeek={onSeek}
					/>
					<div className="text-blue-400">{durationFormat(duration)}</div>
				</div>
			</div>
			<div className="flex gap-2 justify-center">
				<button
					onClick={onPrev}
					className="bg-blue-200 hover:bg-blue-300/50 transition-all p-2 rounded-full my-auto active:scale-95"
				>
					<BackwardIcon className="h-10 w-10 text-blue-400" />
				</button>
				<button
					onClick={() => {
						if (currentMusic) {
							if (isPaused) {
								play();
							} else {
								pause();
							}
						} else {
							handlePlay(0);
						}
					}}
					className="bg-blue-200 hover:bg-blue-300/50 transition-all p-2 rounded-full active:scale-95"
				>
					{isPaused ? (
						<PlayIcon className="h-14 w-14 text-blue-400" />
					) : (
						<PauseIcon className="h-14 w-14 text-blue-400" />
					)}
				</button>
				<button
					onClick={onNext}
					className="bg-blue-200 hover:bg-blue-300/50 transition-all p-2 rounded-full my-auto active:scale-95"
				>
					<ForwardIcon className="h-10 w-10 text-blue-400" />
				</button>
			</div>
		</div>
	);
};
export default Player;
