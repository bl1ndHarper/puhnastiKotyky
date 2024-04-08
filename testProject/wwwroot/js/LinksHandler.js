const knownServices = [
    { domain: "github", faClass: "fa-github" },
    { domain: "linkedin", faClass: "fa-linkedin" },
    { domain: "facebook", faClass: "fa-facebook-f" },
    { domain: "twitter", faClass: "fa-twitter" },
    { domain: "instagram", faClass: "fa-instagram" },
    { domain: "discord", faClass: "fa-discord" },
    { domain: "stackoverflow", faClass: "fa-stack-overflow" },
    { domain: "medium", faClass: "fa-medium" },
    { domain: "codepan", faClass: "fa-codepan" },
    { domain: "telegram", faClass: "fa-telegram" },
    { domain: "t.me", faClass: "fa-telegram" },
    { domain: "pinterest", faClass: "fa-pinterest" },
    { domain: "microsoft", faClass: "fa-microsoft" },
    { domain: "messenger", faClass: "fa-facebook-messenger" },
    { domain: "atlassian", faClass: "fa-atlassian" },
    { domain: "trello", faClass: "fa-trello" },
    { domain: "reddit", faClass: "fa-reddit" },
    { domain: "patreon", faClass: "fa-patreon" },
    { domain: "kickstarter", faClass: "fa-kickstarter-k" },
    { domain: "jira", faClass: "fa-jira" }
];

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    validateDomain(hostname);
    return hostname;
}

function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    validateDomain(domain);
    return domain;
}

const urlHostname = url => {
    try {
        return new URL(url).hostname;
    }
    catch (e) { return e; }
};

const validateDomain = s => {
    try {
        new URL("https://" + s);
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
};

function assignFaClass(link) {
    const domain = extractRootDomain(link);
    const service = knownServices.find(service => domain.includes(service.domain));
    if (service) {
        return "fa-brands " + service.faClass;
    } else {
        return "fa fa-globe";
    }
}