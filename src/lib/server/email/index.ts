import {
	MJ_APIKEY_PRIVATE,
	MJ_APIKEY_PUBLIC,
	MJ_SENDER_EMAIL,
	MJ_SENDER_NAME
} from '$env/static/private';
import {
	getApplicationEmailTemplate,
	type ApplicationEmailTemplateData
} from './applicationTemplate';
import Mailjet from 'node-mailjet';

export async function sendApplicationEmail(
	to: { email: string; name: string },
	data: ApplicationEmailTemplateData
) {
	const htmlContent = getApplicationEmailTemplate(data);

	const mailjet = new Mailjet({
		apiKey: MJ_APIKEY_PUBLIC,
		apiSecret: MJ_APIKEY_PRIVATE
	});

	const request = mailjet.post('send', { version: 'v3.1' }).request({
		Messages: [
			{
				From: {
					Email: MJ_SENDER_EMAIL,
					Name: MJ_SENDER_NAME
				},
				To: [
					{
						Email: to.email,
						Name: to.name
					}
				],
				Subject: 'Somebody applied to your post!',
				TextPart: `${data.applicant.name} has applied to your post. Please check the application details here: ${data.applicationLink}`,
				HTMLPart: htmlContent
			}
		]
	});

	try {
		const result = await request;
		console.log('Email sent successfully:', result.body);
	} catch (error) {
		console.error('Error sending email:', error);
	}
}
