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

// Warning: you can use this function to extract the "root" domain, but it will not be as accurate as using the psl package.

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