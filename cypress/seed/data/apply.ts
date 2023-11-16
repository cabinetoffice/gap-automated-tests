import { TEST_V1_GRANT } from "../../common/constants";

const v1Advert = `
{
 "sections": [
  {
   "pages": [
    {
     "questions": [
      {
       "id": "grantShortDescription",
       "seen": true,
       "response": "This is a short description",
       "multiResponse": null
      }
     ],
     "id": "1",
     "status": "COMPLETED"
    },
    {
     "questions": [
      {
       "id": "grantLocation",
       "seen": true,
       "response": null,
       "multiResponse": [
        "National"
       ]
      }
     ],
     "id": "2",
     "status": "COMPLETED"
    },
    {
     "questions": [
      {
       "id": "grantFunder",
       "seen": true,
       "response": "The Department of Business",
       "multiResponse": null
      }
     ],
     "id": "3",
     "status": "COMPLETED"
    },
    {
     "questions": [
      {
       "id": "grantApplicantType",
       "seen": true,
       "response": null,
       "multiResponse": [
        "Personal / Individual"
       ]
      }
     ],
     "id": "4",
     "status": "COMPLETED"
    }
   ],
   "id": "grantDetails",
   "status": "COMPLETED"
  },
  {
   "pages": [
    {
     "questions": [
      {
       "id": "grantTotalAwardAmount",
       "seen": true,
       "response": "1000000",
       "multiResponse": null
      },
      {
       "id": "grantMaximumAward",
       "seen": true,
       "response": "10000",
       "multiResponse": null
      },
      {
       "id": "grantMinimumAward",
       "seen": true,
       "response": "£1",
       "multiResponse": null
      }
     ],
     "id": "1",
     "status": "COMPLETED"
    }
   ],
   "id": "awardAmounts",
   "status": "COMPLETED"
  },
  {
   "pages": [
    {
     "questions": [
      {
       "id": "grantApplicationOpenDate",
       "seen": true,
       "response": null,
       "multiResponse": [
        "24",
        "08",
        "2023",
        "00",
        "01"
       ]
      },
      {
       "id": "grantApplicationCloseDate",
       "seen": true,
       "response": null,
       "multiResponse": [
        "24",
        "10",
        "2040",
        "23",
        "59"
       ]
      }
     ],
     "id": "1",
     "status": "COMPLETED"
    }
   ],
   "id": "applicationDates",
   "status": "COMPLETED"
  },
  {
   "pages": [
    {
     "questions": [
      {
       "id": "grantWebpageUrl",
       "seen": true,
       "response": "${TEST_V1_GRANT.applicationUrl}",
       "multiResponse": null
      }
     ],
     "id": "1",
     "status": "COMPLETED"
    }
   ],
   "id": "howToApply",
   "status": "COMPLETED"
  },
  {
   "pages": [
    {
     "questions": [
      {
       "id": "grantEligibilityTab",
       "seen": true,
       "response": null,
       "multiResponse": [
        "<p>This is our Eligibility information</p>",
        "{\\"nodeType\\":\\"document\\",\\"data\\":{},\\"content\\":[{\\"nodeType\\":\\"paragraph\\",\\"content\\":[{\\"nodeType\\":\\"text\\",\\"value\\":\\"This is our Eligibility information\\",\\"marks\\":[],\\"data\\":{}}],\\"data\\":{}}]}"
       ]
      }
     ],
     "id": "1",
     "status": "COMPLETED"
    },
    {
     "questions": [
      {
       "id": "grantSummaryTab",
       "seen": true,
       "response": null,
       "multiResponse": [
        "<p>This is our Summary information</p>",
        "{\\"nodeType\\":\\"document\\",\\"data\\":{},\\"content\\":[{\\"nodeType\\":\\"paragraph\\",\\"content\\":[{\\"nodeType\\":\\"text\\",\\"value\\":\\"This is our Summary information\\",\\"marks\\":[],\\"data\\":{}}],\\"data\\":{}}]}"
       ]
      }
     ],
     "id": "2",
     "status": "COMPLETED"
    },
    {
     "questions": [
      {
       "id": "grantDatesTab",
       "seen": true,
       "response": null,
       "multiResponse": [
        "<p>This is our Date information</p>",
        "{\\"nodeType\\":\\"document\\",\\"data\\":{},\\"content\\":[{\\"nodeType\\":\\"paragraph\\",\\"content\\":[{\\"nodeType\\":\\"text\\",\\"value\\":\\"This is our Date information\\",\\"marks\\":[],\\"data\\":{}}],\\"data\\":{}}]}"
       ]
      }
     ],
     "id": "3",
     "status": "COMPLETED"
    },
    {
     "questions": [
      {
       "id": "grantObjectivesTab",
       "seen": true,
       "response": null,
       "multiResponse": [
        "<p>This is our Objectives information</p>",
        "{\\"nodeType\\":\\"document\\",\\"data\\":{},\\"content\\":[{\\"nodeType\\":\\"paragraph\\",\\"content\\":[{\\"nodeType\\":\\"text\\",\\"value\\":\\"This is our Objectives information\\",\\"marks\\":[],\\"data\\":{}}],\\"data\\":{}}]}"
       ]
      }
     ],
     "id": "4",
     "status": "COMPLETED"
    },
    {
     "questions": [
      {
       "id": "grantApplyTab",
       "seen": true,
       "response": null,
       "multiResponse": [
        "<p>This is our application information</p>",
        "{\\"nodeType\\":\\"document\\",\\"data\\":{},\\"content\\":[{\\"nodeType\\":\\"paragraph\\",\\"content\\":[{\\"nodeType\\":\\"text\\",\\"value\\":\\"This is our application information\\",\\"marks\\":[],\\"data\\":{}}],\\"data\\":{}}]}"
       ]
      }
     ],
     "id": "5",
     "status": "COMPLETED"
    },
    {
     "questions": [
      {
       "id": "grantSupportingInfoTab",
       "seen": true,
       "response": null,
       "multiResponse": [
        "<p>This is our supporting information</p>",
        "{\\"nodeType\\":\\"document\\",\\"data\\":{},\\"content\\":[{\\"nodeType\\":\\"paragraph\\",\\"content\\":[{\\"nodeType\\":\\"text\\",\\"value\\":\\"This is our supporting information\\",\\"marks\\":[],\\"data\\":{}}],\\"data\\":{}}]}"
       ]
      }
     ],
     "id": "6",
     "status": "COMPLETED"
    }
   ],
   "id": "furtherInformation",
   "status": "COMPLETED"
  }
 ]
}`;

export { v1Advert };
