This are just a few examples I will be working to get information out of the discord api

This was ChatGPT assited

Note: Create a file name Config.json based on the file Config.example.json, and fill the required information for your use case

---

1.- Message Archiver

This function archives the entire messages from a given user in a given server.

Parameters:

user: User; -- The Username and User Id

server: Server; -- The Server Name and Server Id

fileName?: string; -- (Optional) An alternative filename. Will still be in /Results

channelsToSearchFor?: string[]; -- (Optional) A list of channel names you want the Archiver to pull messages from. Everything else will be ignored

---
