# SýndessIT

SýndessIT is a developer collaboration platform build with ASP.NET Core MVC. The website enables users to find a team to implement their own IT project idea or join existing projects. It`s simple to use, has a user-friendly interface and will be helpful for developers of all skill levels.

## Features

- User Profiles: Create and manage your personal profile.
- Project Search: Find projects using filters and recommendations based on your skills.
- Project Management: Create new projects and request participation in existing ones.
- Notifications: Stay updated with notifications about your projects.
- Help Page: Find answers to frequently asked questions or contact the developers.

## Built With

Project is created with:

- ASP.NET CORE MVC
- MySQL
- HTML, CSS, JavaScript

## Future Development

Future updates will focus on improving the organization of the teamwork. Such features as Scrum boards and team chats will be introduced to help team members collaborate more effectively.

## Getting Started

To get a local copy up and running follow the steps bellow.

1. **Clone the repo**

   `git clone https://github.com/bl1ndHarper/puhnastiKotyky.git`

2. **Create a .env file in the root directory of the project**

   The project uses Google and GitHub as external services for login, so you'll need to visit these websites and generate ClientIDs and ClientSecrets. You'll also have to get an ApiKey and ApiSecret from Coudinary Dashboard to be able to store images uploaded by the users. For more information on how to do that check out the following links:

   [Get GitHub Client ID and Client Secret](https://episyche.com/blog/how-to-create-oauth-client-id-and-client-secret-for-github)

   [Get Google Client ID and Client Secret](https://analytify.io/get-google-client-id-and-client-secret/)

   Return to your .env file and set environment variables as shown below:

   ```
   GOOGLE_CLIENTID=[Enter Your ClientID here]
   GOOGLE_CLIENTSECRET=[Enter Your ClientSecret here]
   GITHUB_CLIENTID=[Enter Your ClientID here]
   GITHUB_CLIENTSECRET=[Enter Your ClientSecret here]
   GITHUB_REDIRECTURI=https://localhost:[Enter Your Port here]/Account/Account/Index
   CLOUDINARY_CLOUDNAME=[Enter Your Cloud name here]
   CLOUDINARY_APIKEY=[Enter Your ApiKey here]
   CLOUDINARY_APISECRET=[Enter Your ApiSecret here]
   ```

   Also insert an email address credentials for sending sign up confirmation and password recovery emails

   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=[Enter Your email adress here]
   SMTP_PASSWORD=[Enter Your 16-digit Application Password here]
   ```

3. **Create a MySql database**

   Add the connection string to the .env file:

   `CONNECTIONSTRINGS_DEFAULTCONNECTION=server=[your server name];port=[your port];database=[your db name];user=[your user name];password=[your db password]`

4. **Apply migrations**

   Open up a Package Manager Console in Visual Studio and run the following command:

   `Update-Database`

## Contributing

Your contributions are greatly appreciated. If you have a suggestion to improve this project, please follow these steps to fork the repo and create a pull request:

- Fork the Project
- Create your Feature Branch (git checkout -b feature/NewFeature)
- Commit your Changes (git commit -m 'Add some NewFeature')
- Push to the Branch (git push origin feature/NewFeature)
- Open a Pull Request

## License

Distributed under the MIT License.
