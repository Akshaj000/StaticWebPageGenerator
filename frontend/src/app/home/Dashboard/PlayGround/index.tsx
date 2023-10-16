import { useEffect } from "react";
import { toast } from "react-toastify";
import CodeContainer from "@/app/home/Dashboard/PlayGround/CodeContainer";
import Link from "next/link";
import clientFetcher from "@/app/clientFetcher";

const PlayGround = ({ session, setSession }: any) => {

    const setState = (state: any) => {
        setSession((prevSession: any) => {
            return {
                ...prevSession,
                webpage: {
                    ...prevSession.webpage,
                    state: state,
                },
            };
        });
    }

    const handleSessionData = (data: any) => {
        setSession(data);
        setState(data?.webpage?.state || null);
    };


    const fetchSession = async ({id}: { id: any }) => {
        const response = await clientFetcher(`session/?id=${id}`)
        if (response?.data) {
            handleSessionData(response.data);
        }
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const fetchData = () => {
            if (session?.id) {
                fetchSession({ id: session?.id });
            }
        };

        const shouldFetchData = () => {
            if (session?.webpage?.state && session?.webpage?.hostOnGithub && session?.webpage?.state !== "PUBLISHED") return true; // Fetch every 3 seconds until PUBLISHED if hostOnGithub is true
            if (session?.webpage?.state && !session?.webpage?.hostOnGithub && session?.webpage?.state !== "GENERATED") return true; // Fetch every 3 seconds until GENERATED if hostOnGithub is false
            return false; // Stop fetching when PUBLISHED (if hostOnGithub is true) or GENERATED (if hostOnGithub is false)
        };

        if (shouldFetchData()) {
            fetchData();
            intervalId = setInterval(fetchData, 3000);
        }

        return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }, [session?.webpage?.state]);


    const handleRegenerate = async () => {
        const response = await clientFetcher(`webpage/regenerate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                topic: session?.webpage?.topic,
                specifications: session?.webpage?.specifications,
                hostOnGithub: session?.webpage?.hostOnGithub,
                sessionID: session?.id,
            }),
        })
        if (response?.status === 200) {
            toast.success("Website is being regenerated");
            setState("GENERATING");
        } else {
            toast.error("Error regenerating website");
            return null;
        }
    };

    const handleGenerate = async () => {
        if (session?.webpage?.state) {
            handleRegenerate();
            return;
        }
        const response = await clientFetcher(`webpage/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                topic: session?.webpage?.topic,
                specifications: session?.webpage?.specifications,
                hostOnGithub: session?.webpage?.hostOnGithub,
                sessionID: session?.id,
            }),
        })
        if (response?.status === 200) {
            toast.success("Website is being generated");
            setState("GENERATING");
        }
    };

    const handlePublish = async () => {
        const response = await clientFetcher(`webpage/publish`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sessionID: session?.id,
            }),
        })
        if (response?.status === 200) {
            toast.success("Website is being published");
            setState("PUBLISHING");
            setSession({...session, webpage: {...session.webpage, hostOnGithub: true}})
        } else {
            toast.error("Error publishing website");
            return null;
        }
    }


    const handleDeleteDeployment = async () => {
        setState("PUBLISHING")
        const response = await clientFetcher(`webpage/delete-deployment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sessionID: session?.id,
            }),
        })
        if (response?.status === 200) {
            toast.success("Website is being deleted");
            setState("GENERATED");
            setSession({...session, webpage: {...session.webpage, hostOnGithub: false}})
        } else {
            toast.error("Error deleting website");
            return null;
        }
    }


    return (
        <div className="scroll justify-center p-9 overflow-auto h-[100dvh] w-full bg-gray-950" key={"current" + session?.id}>
            {session ? (
            <div className="text-white flex flex-col">
                <h1 className="text-4xl font-bold mb-4">Automated AI Static Website Generator</h1>
                    <div className="mb-8">
                        <p className="text-lg">
                            Enter the topic and specification of your website, and we will generate a static website for you.
                            Please note that this is a work in progress, and the generated website may not be perfect.
                            This will generate a static HTML, CSS, and JS website.
                        </p>
                        <div className="py-6 rounded-lg shadow-lg bg-gray-900 mt-6 p-6">
                            <div className="mb-4">
                                <label htmlFor="topic" className="text-lg font-semibold">
                                    Topic:
                                </label>
                                <input
                                    type="text"
                                    id="topic"
                                    disabled={session?.webpage?.state}
                                    value={session?.webpage?.topic || ""}
                                    onChange={(e) => setSession({
                                        ...session,
                                        webpage: {
                                            ...session.webpage,
                                            topic: e.target.value,
                                        }
                                    })}
                                    className="w-full px-3 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="specification" className="text-lg font-semibold">
                                    Specification:
                                </label>
                                {session?.webpage?.state && <p>Enter updated specification. Ai will regenerate the website based on the previous generated code.</p>}
                                <textarea
                                    id="specification"
                                    value={session?.webpage?.specifications || ""}
                                    onChange={(e) => setSession({
                                        ...session,
                                        webpage: {
                                            ...session.webpage,
                                            specifications: e.target.value,
                                        }
                                    })}
                                    className="w-full h-80 px-3 py-2 rounded-md bg-gray-800 text-white focus:outline-none resize-none mt-2 scroll"
                                />
                            </div>
                            {!session?.webpage?.state && (
                                <div>
                                    <p className="text-lg my-6">
                                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                                        If you want to host the website on GitHub, please check the checkbox below and also don't forget to
                                        enter your GitHub credentials in User Settings.
                                    </p>
                                <div className="mb-6 flex items-center">
                                    <label htmlFor="hostOnGithub" className="text-lg font-semibold">
                                    Host on GitHub:
                                    </label>
                                        <input
                                            type="checkbox"
                                            id="hostOnGithub"
                                            checked={session?.webpage?.hostOnGithub || false}
                                            onChange={() => setSession({ ...session, webpage: { ...session?.webpage, hostOnGithub: !session?.webpage?.hostOnGithub } })}
                                            className="h-6 w-6 ml-2"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleGenerate}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold focus:outline-none w-32"
                                >
                                    {session?.webpage?.state ? "Regenerate" : "Generate"}
                                </button>
                            </div>
                        </div>
                    </div>
                {session?.webpage?.state == "GENERATING" && (
                    <div className="bg-gray-900 rounded-lg shadow-lg p-4 mb-8">
                        <p className="text-lg">
                            Your website is being generated. This may take a few minutes...
                        </p>
                    </div>
                )}
                {session?.webpage?.state == "GENERATED" && (
                    <div className="bg-gray-900 rounded-lg shadow-lg p-4 mb-8 flex justify-between items-center px-6">
                        <p>
                            Your website is generated. Would you like to publish it?
                        </p>
                        <button
                            onClick={handlePublish}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md mt-3 w-32 font-semibold focus:outline-none"
                        >
                            Publish
                        </button>
                    </div>
                )}
                {session?.webpage?.state == "PUBLISHING" && (
                    <div className="bg-gray-900 rounded-lg shadow-lg p-4 mb-8">
                        <p className="text-lg mb-4">
                            Your website is being published. This may take a few minutes...
                        </p>
                    </div>
                )}
                {session?.webpage?.state == "PUBLISHED" && (
                    <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-8 flex justify-between items-center">
                        <div>
                            <p className="text-lg mb-4">
                                {session?.webpage?.deployment_status}. You can view it at the link below.
                            </p>
                            <div className="mt-4">
                                <Link
                                    href={session?.webpage?.url || ""}
                                    target="_blank"
                                    className="text-blue-600 hover:underline font-semibold"
                                >
                                    {session?.webpage?.url}
                                </Link>
                            </div>
                        </div>
                        <button
                            onClick={handleDeleteDeployment}
                            className="px-4 py-2 bg-red-600 text-white rounded-md mt-3 font-semibold focus:outline-none w-32"
                        >
                            Delete
                        </button>
                    </div>
                )}
                {["GENERATED", "PUBLISHING", "PUBLISHED"].includes(session?.webpage?.state) && (
                    <div key={session?.id}>
                        <CodeContainer session={session} setState={setState} />
                    </div>
                )}
            </div>
        ) : (
            <div className="text-white flex flex-col justify-center w-full p-8 sm:p-20 md:p-32">
                <h1 className="text-4xl font-bold mb-4">Automated AI Static Website Generator</h1>
                <p className="text-lg">
                    We will generate a static website and host it on GitHub for you.
                    Please note that this is a work in progress and the generated website may not be perfect.
                </p>
                <p className="text-lg my-6 font-bold">
                    Please create or select a session from the sidebar to generate a website.
                </p>
            </div>
        )}
      </div>
    );
};

export default PlayGround;
