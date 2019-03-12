import * as Dockerode from "dockerode";

const DATABASE_IMAGE = "postgres:latest";
const CONTAINER_NAME = "perfectweek-db";

const DB_NAME = process.env.DB_NAME || "perfectweek";
const DB_USER = process.env.DB_USER || "perfectweek";
const DB_PASSWORD = process.env.DB_PASSWORD || "password";

const HOST_IP = process.env.HOST_IP || "127.0.0.1";
const HOST_PORT = process.env.HOST_PORT || "5432";

export const database_setup = async () => {
    const docker = new Dockerode();

    await pullDatabase(docker);
    const container = await createContainer(docker);
    await startContainer(container);
};

export const database_start = async () => {
    const docker = new Dockerode();

    const container = docker.getContainer(CONTAINER_NAME);
    await startContainer(container);
};

export const database_stop = async () => {
    const docker = new Dockerode();

    const container = docker.getContainer(CONTAINER_NAME);
    await stopContainer(container);
};

export const database_delete = async () => {
    const docker = new Dockerode();

    const container = docker.getContainer(CONTAINER_NAME);
    await removeContainer(container);
}

//
// Implementation details
//

const pullDatabase = async (docker: Dockerode) => {
    console.info(`Docker: Pulling image "${DATABASE_IMAGE}"`);

    return new Promise((ok, ko) => {
        docker.pull(DATABASE_IMAGE, (error: Error, stream: any) => {
            if (error) {
                ko(error);
            }

            docker.modem.followProgress(stream, () => {
                console.info("Docker: Done");
                ok();
            });
        });
    });
};

const createContainer = async (docker: Dockerode): Promise<Dockerode.Container> => {
    console.info(`Docker: Creating container "${CONTAINER_NAME}"`);

    const container = await docker.createContainer({
        name: CONTAINER_NAME,
        Image: DATABASE_IMAGE,
        Env: [
            `POSTGRES_DB=${DB_NAME}`,
            `POSTGRES_USER=${DB_USER}`,
            `POSTGRES_PASSWORD=${DB_PASSWORD}`
        ],
        HostConfig: {
            Binds: [],
            PortBindings: {
                "5432/tcp": [
                    {
                        HostIp: HOST_IP,
                        HostPort: HOST_PORT
                    }
                ]
            }
        }
    });

    console.info("Docker: Done");

    return container;
};

const startContainer = async (container: Dockerode.Container) => {
    console.info(`Docker: Starting container ${CONTAINER_NAME}`);
    await container.start();
    console.info("Docker: Done");
};

const stopContainer = async (container: Dockerode.Container) => {
    console.info(`Docker: Stoping container ${CONTAINER_NAME}`);
    await container.stop();
    console.info("Docker: Done");
};

const removeContainer = async (container: Dockerode.Container) => {
    console.info(`Docker: Removing container ${CONTAINER_NAME}`);
    await container.remove({ force: true });
    console.info("Docker: Done");
};
