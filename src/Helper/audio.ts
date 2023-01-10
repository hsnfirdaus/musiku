import * as jsmediatags from "jsmediatags";

export interface MusicDataResult {
	originalName: string;
	size: number;
	title?: string;
	artist?: string;
	genre?: string;
	picture?: Blob;
	file: File;
}

export const readMusicData = (file: File): Promise<MusicDataResult> => {
	return new Promise((resolve, reject) => {
		var split = file.name.replace(/\.[^/.]+$/, "").split("-");
		jsmediatags.read(file, {
			onSuccess: (res) => {
				let data = {
					originalName: file.name,
					size: file.size,
					title: res.tags.title ?? split[0],
					artist: res.tags.artist ?? split[1],
					genre: res.tags.genre ?? "Unknown Genre",
					picture: res.tags.picture?.data
						? new Blob([new Uint8Array(res.tags.picture.data).buffer], { type: res.tags.picture.format })
						: undefined,
					file,
				};

				resolve(data);
			},
			onError: (error) => {
				let data = {
					originalName: file.name,
					size: file.size,
					title: split[0],
					artist: split[1],
					genre: "Unknown Genre",
					picture: undefined,
					file,
				};

				resolve(data);
			},
		});
	});
};
export const durationFormat = (time: number) => {
	var mins = Math.floor(time / 60);
	var minPadded = "00";
	if (mins < 10) {
		minPadded = "0" + String(mins);
	} else {
		minPadded = mins + "";
	}
	var secs = Math.floor(time % 60);
	var secsPadded = "00";
	if (secs < 10) {
		var secsPadded = "0" + String(secs);
	} else {
		secsPadded = secs + "";
	}

	return minPadded + ":" + secsPadded;
};
