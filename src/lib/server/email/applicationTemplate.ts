import mjml2html from 'mjml';

export type ApplicationEmailTemplateData = {
	name: string;
	applicantName: string;
	applicantEmail: string;
	applicantBio: string | null;
	applicantPfp: string | null;
	questions: { label: string; response: string }[];
	applicationLink: string;
};

export const getApplicationEmailTemplate = (data: ApplicationEmailTemplateData): string =>
	mjml2html(`
<mjml>
  <mj-body color="#030712" background-color="#f9fafb" font-family="sans-serif">
    <mj-section background-color="#ffffff" padding-bottom="20px" padding-top="20px">
      <mj-column width="100%">
        <mj-text align="center" font-size="24px" padding-left="25px" padding-right="25px" padding-bottom="18px" padding-top="18px">
          <strong>Astro Connect</strong>
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#f9fafb" padding-bottom="0px" padding-top="0px">
      <mj-column width="100%">
        <mj-text align="center" font-size="13px" padding-left="25px" padding-right="25px" padding-bottom="12px" padding-top="28px">HELLO
          <p style="font-size:16px;">${data.name || 'Researcher'}</p>
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#f9fafb" padding-bottom="5px" padding-top="0">
      <mj-column width="100%">
        <mj-text align="center" font-size="13px" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="12px">
          <span style="font-size:20px; font-weight:bold">Somebody has applied to your Research!</span>
          <br />
          <span style="font-size:15px">Please find the application below.</span>
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" padding-bottom="15px">
      ${
				data.applicantPfp
					? `
      <mj-column>
        <mj-image src="${data.applicantPfp}" alt="Profile Picture" width="64px" height="64px" border-radius="100%" />
      </mj-column>
      `
					: ''
			}
      <mj-column width="100%">
        <mj-text align="center" font-size="15px" padding-left="15px" padding-right="15px" padding-bottom="0px">
          <strong>${data.applicantName}</strong>
          <i>(${data.applicantEmail})</i>
        </mj-text>
        <mj-text align="center" font-size="13px" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${data.applicantBio || 'No Bio Provided'}</mj-text>

        <mj-divider border-color="#99a1af" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" padding-bottom="32px">

      ${data.questions
				.map(
					(q) => `
      <mj-column width="100%">
        <mj-text align="center" font-size="15px" padding-left="25px" padding-right="25px" padding-bottom="0px">
          <strong>${q.label}</strong>
        </mj-text>
        <mj-text align="center" font-size="13px" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">
          <span>${q.response}</span>
        </mj-text>
      </mj-column>
      `
				)
				.join('')}
      
      
    </mj-section>
    <mj-section background-color="#f9fafb" padding-bottom="20px" padding-top="20px">
      <mj-column width="50%">
        <mj-button background-color="#101828" color="#FFF" font-size="14px" align="center" font-weight="bold" border="none" padding="15px 30px" border-radius="10px" href='${data.applicationLink}' padding-left="25px" padding-right="25px" padding-bottom="10px">View Application</mj-button>
      </mj-column>
      <mj-column width="50%">
        <mj-button background-color="#101828" color="#FFF" font-size="14px" align="center" font-weight="bold" border="none" padding="15px 30px" border-radius="10px" href="https://astroconnect-demo.netlify.app/dashboard/published" padding-left="25px" padding-right="25px" padding-bottom="12px">My Dashboard</mj-button>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" padding-bottom="5px" padding-top="0">
      <mj-column width="100%">
        <mj-text align="center" font-size="15px" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="20px">
          <a href="https://astroconnect-demo.netlify.app/home" style="font-size:15px;color:#030712">Astro Connect</a>
          <span>-</span>
          <a href="https://astroconnect-demo.netlify.app/dashboard/settings" style="font-size:15px;color:#030712">Disable These Emails</a>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`).html;
