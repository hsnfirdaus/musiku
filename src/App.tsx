import Player from "./Layout/Player";
import Playlist from "./Layout/Playlist";

const App: React.FC = () => {
	return (
		<div className="bg-blue-100">
			<div className="grid gap-10 grid-cols-12 w-full">
				<div className="col-span-6 h-screen p-10 overflow-hidden">
					<Player />
				</div>
				<div className="col-span-6 h-screen py-10 overflow-hidden">
					<Playlist />
				</div>
			</div>
		</div>
	);
};
export default App;
