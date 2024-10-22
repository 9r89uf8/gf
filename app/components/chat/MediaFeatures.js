import React from 'react';
import { Camera, Video, Mic } from 'lucide-react';

const MediaFeatures = () => {
    const features = [
        {
            icon: <Camera className="w-6 h-6" />,
            title: "Imágenes",
            description: "Recibe fotos exclusivas"
        },
        {
            icon: <Video className="w-6 h-6" />,
            title: "Videos",
            description: "Contenido en video personalizado"
        },
        {
            icon: <Mic className="w-6 h-6" />,
            title: "Audios",
            description: "Mensajes de voz privados"
        }
    ];

    return (
        <div className="w-full max-w-md mx-auto p-6 space-y-6">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                    Contenido Multimedia
                </h3>
                <p className="text-gray-300 mt-2">
                    Disfruta de una experiencia interactiva completa
                </p>
            </div>

            <div className="grid gap-4">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="relative group rounded-xl p-4 transition-all duration-300 hover:scale-105"
                        style={{
                            background: "linear-gradient(45deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1))",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.1)"
                        }}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600">
                                {feature.icon}
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-lg">
                                    {feature.title}
                                </h4>
                                <p className="text-gray-300 text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                        <div className="absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                             style={{
                                 background: "linear-gradient(45deg, rgba(236,72,153,0.1), rgba(167,139,250,0.1))",
                                 pointerEvents: "none"
                             }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MediaFeatures;