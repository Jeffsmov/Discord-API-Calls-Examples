export type User = {
  userId: string;
  userName: string;
};

export type Server = {
  serverId: string;
  serverName: string;
};

export type Config = {
  token: string;
  serverId: string;
  userId: string;
  fileName: string;
  serverList?: string[];
};
