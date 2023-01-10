interface Props {
	min: number;
	max: number;
	current: number;
	onSeek: (value: number) => void;
}
const Progress: React.FC<Props> = ({ min, max, current, onSeek }) => {
	return (
		<div className="flex-1 bg-blue-200 rounded-2xl relative overflow-hidden">
			<div
				className="absolute left-0 h-full rounded-2xl bg-blue-300"
				style={{ width: Math.round((current / max) * 100) + "%" }}
			></div>
			<input
				className="absolute inset-0 opacity-0 cursor-pointer"
				type="range"
				value={current}
				onChange={(e) => onSeek(e.target.value ? Number(e.target.value) : 0)}
				min={min}
				max={max}
			/>
		</div>
	);
};
export default Progress;
