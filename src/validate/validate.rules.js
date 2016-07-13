export default const rules = {
  thesis: [
    {
      name: "authorFirstname",
      rules: [
        {
          type: "notEmpty",
          prompt: "First name can't be empty.",
        },
      ],
    },
    {
      name: "authorLastname",
      rules: [
        {
          type: "notEmpty",
          prompt: "Last name can't be empty.",
        },
      ],
    },
    {
      name: "authorEmail",
      rules: [
        {
          type: "notEmpty",
          prompt: "Email can't be empty.",
        },
        {
          type: "validEmail",
          prompt: "Not a valid email.",
        },
      ],
    },
    {
      name: "title",
      rules: [
        {
          type: "notEmpty",
          prompt: "Title can't be empty.",
        },
      ],
    },
    {
      name: "StudyFieldId",
      rules: [
        {
          type: "notEmpty",
          prompt: "You must choose a studyfield.",
        },
      ],
    },
    {
      name: "grade",
      rules: [
        {
          type: "notEmpty",
          prompt: "You must choose a grade.",
        },
      ],
    },
    {
      name: "Graders",
      model: "grader",
      rules: [
        {
          type: "minCount[2]",
          prompt: "You must have at least two graders.",
        },
      ],
    },
    {
      name: "CouncilMeetingId",
      rules: [
        {
          type: "notEmpty",
          prompt: "You must choose a council meeting.",
        },
      ],
    },
  ],
  grader: [
    {
      name: "name",
      rules: [
        {
          type: "notEmpty",
          prompt: "Grader name can't be empty.",
        },
      ],
    },
    {
      name: "title",
      rules: [
        {
          type: "notEmpty",
          prompt: "Grader title can't be empty.",
        },
      ],
    },
  ],
  user: [
    {
      name: "firstname",
      rules: [
        {
          type: "notEmpty",
          prompt: "First name can't be empty.",
        },
      ],
    },
    {
      name: "lastname",
      rules: [
        {
          type: "notEmpty",
          prompt: "Last name can't be empty.",
        },
      ],
    },
    {
      name: "email",
      rules: [
        {
          type: "notEmpty",
          prompt: "Email can't be empty.",
        },
        {
          type: "validEmail",
          prompt: "Not a valid email.",
        },
      ],
    },
    {
      name: "password",
      rules: [
        {
          type: "notEmpty",
          prompt: "Password can't be empty.",
        },
        {
          type: "minLength[8]",
          prompt: "Password must be at least 8 characters.",
        },
      ],
    },
    {
      name: "passwordConf",
      rules: [
        {
          type: "match[password]",
          prompt: "Passwords must match.",
        },
      ],
    },
  ],
};