<h1><img alt="temporary kubefeed logo" align="right" height="350" src="https://github.com/tylerauerbeck/kubefeed/raw/main/assets/images/kubefeed.png">KUBEFEED</h1>


Kubefeed is a set of feeds generated off of the releases of the Kubernetes project.
<br>
<br><br><br>
<br>
## Why

Currently using the feeds and APIs provided by GitHub, you only receive a subset of releases. Some use cases require access to a larger or full dataset. In addition to this, it can be beneficial to filter as necessary

Kubefeed instead gives you access to the entire dataset and provides filters for the following:
- individual releases
- filter draft releases
- filter prereleases
- include release notes

## How

The current feeds are generated based off of calls to the GitHub Releases API. This populates a data file containing the information we're interested in. We use this static file generator instead of making API calls each time a user requests the feed to avoid any rate-limit issues against the GitHub API. Ultimately as this data doesn't change frequently, this should meet the needs of most use cases. 


