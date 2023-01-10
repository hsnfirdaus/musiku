import { MusicModel } from "../Model/music";
import { MusicDataResult } from "./audio";

export const insertDB = (repo: IDBObjectStore, value: any): Promise<number> => {
	return new Promise((resolve, reject) => {
		let res = repo.add(value);
		res.onsuccess = () => {
			resolve(Number(res.result));
		};
		res.onerror = (err) => {
			reject(err);
		};
	});
};
export const deleteDB = (repo: IDBObjectStore, key: number): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		let res = repo.delete(key);
		res.onsuccess = () => {
			resolve(true);
		};
		res.onerror = (err) => {
			reject(err);
		};
	});
};
export const insertMusic = (DB: IDBDatabase, data: MusicDataResult): Promise<MusicModel> => {
	return new Promise(async (resolve, reject) => {
		try {
			const transaction = DB.transaction(["musics", "files"], "readwrite");
			transaction.onerror = (err) => {
				reject(err);
			};
			let fileRepositories = transaction.objectStore("files");
			let pictureFileId: number | undefined;
			if (data.picture) {
				pictureFileId = await insertDB(fileRepositories, data.picture);
			}
			let fileFileId = await insertDB(fileRepositories, data.file);

			let musicRepositories = transaction.objectStore("musics");
			let dto: Omit<MusicModel, "musicId"> = {
				fileName: data.originalName,
				size: data.size,
				title: data.title,
				artist: data.artist,
				genre: data.genre,
				pictureFileId,
				fileFileId,
			};
			let res = await insertDB(musicRepositories, dto);
			let callback = {
				musicId: res,
				...dto,
			};
			resolve(callback);
		} catch (error) {
			reject(error);
		}
	});
};
export const deleteMusic = (DB: IDBDatabase, musicId: number): Promise<boolean> => {
	return new Promise(async (resolve, reject) => {
		try {
			let music = await getSingleMusic(DB, musicId);
			if (!music) return reject(music);

			const transaction = DB.transaction(["musics", "files"], "readwrite");
			transaction.onerror = (err) => {
				reject(err);
			};
			let fileRepositories = transaction.objectStore("files");
			if (music.pictureFileId) {
				await deleteDB(fileRepositories, music.pictureFileId);
			}
			await deleteDB(fileRepositories, music.fileFileId);

			let musicRepositories = transaction.objectStore("musics");
			await deleteDB(musicRepositories, musicId);

			resolve(true);
		} catch (error) {
			reject(error);
		}
	});
};
export const getAllMusic = (DB: IDBDatabase): Promise<MusicModel[]> => {
	return new Promise(async (resolve, reject) => {
		try {
			const transaction = DB.transaction("musics", "readonly");
			transaction.onerror = (err) => {
				reject(err);
			};
			let musicRepositories = transaction.objectStore("musics");
			let request = musicRepositories.openCursor();
			request.onerror = function (event) {
				return reject(event);
			};
			var data: MusicModel[] = [];
			request.onsuccess = function (event) {
				var cursor = request.result;
				if (cursor) {
					let key = cursor.primaryKey;
					let value = cursor.value;
					data = [
						...data,
						{
							musicId: Number(key),
							...value,
						},
					];
					cursor.continue();
				} else {
					resolve(data);
				}
			};
		} catch (error) {
			reject(error);
		}
	});
};
export const getSingleFile = (DB: IDBDatabase, key: number): Promise<File | Blob> => {
	return new Promise(async (resolve, reject) => {
		try {
			const transaction = DB.transaction("files", "readonly");
			transaction.onerror = (err) => {
				reject(err);
			};
			let fileRepositories = transaction.objectStore("files");
			let request = fileRepositories.get(key);

			request.onsuccess = () => {
				resolve(request.result);
			};
			request.onerror = (err) => {
				reject(err);
			};
		} catch (error) {
			reject(error);
		}
	});
};
export const getSingleMusic = (DB: IDBDatabase, key: number): Promise<MusicModel> => {
	return new Promise(async (resolve, reject) => {
		try {
			const transaction = DB.transaction("musics", "readonly");
			transaction.onerror = (err) => {
				reject(err);
			};
			let musicRepositories = transaction.objectStore("musics");
			let request = musicRepositories.get(key);

			request.onsuccess = () => {
				resolve(request.result);
			};
			request.onerror = (err) => {
				reject(err);
			};
		} catch (error) {
			reject(error);
		}
	});
};
