/**
 * A helper function to upload a file to an s3 bucket with progress and error handling.
 * When an error occurs, the promise with reject with a string describing the error.
 * @param url The url of the object, ideally presigned
 * @param file The file used to upload, e.x. from a file input
 * @param onprogress A callback for file upload process, from 0-1
 */
export default async function uploadToS3(
	url: string,
	file: XMLHttpRequestBodyInit,
	onprogress?: (progress: number) => void
): Promise<void> {
	return new Promise((resolve, reject) => {
		let req = new XMLHttpRequest();
		req.upload.onprogress = (event) => {
			onprogress?.(event.loaded / event.total);
		};
		req.upload.onerror = (event) => {
			console.error('Upload error', event);
			reject('Error during upload');
		};
		req.upload.onloadend = (event) => {
			onprogress?.(event.loaded / event.total);
		};
		req.onreadystatechange = () => {
			if (req.readyState === 4) {
				if (req.status === 200) {
					resolve();
				} else {
					let message = req.responseXML?.querySelector('Message')?.textContent || 'Unknown Error';
					console.error('Upload error' + req.status + ': ' + req.statusText, req.responseXML);
					reject('Failed to upload: ' + req.status + ': ' + message);
				}
			}
		};
		req.open('PUT', url, true);
		req.send(file);
	});
}
