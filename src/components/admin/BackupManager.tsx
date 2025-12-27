"use client";

import { useState, useEffect } from "react";
import { Download, Trash2, Loader2, RefreshCw, Database, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Backup {
    name: string;
    size: number;
    sizeFormatted: string;
    created: string;
}

export function BackupManager() {
    const [loading, setLoading] = useState(false);
    const [backups, setBackups] = useState<Backup[]>([]);
    const [stats, setStats] = useState({ total: 0, totalSize: 0 });
    const [lastBackup, setLastBackup] = useState<any>(null);

    useEffect(() => {
        loadBackups();
    }, []);

    const createBackup = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/backup', { method: 'POST' });
            const data = await res.json();

            if (data.success) {
                setLastBackup(data);
                toast.success(`Backup created successfully! (${data.sizeFormatted})`);
                await loadBackups();
            } else {
                toast.error(data.error || 'Backup failed');
            }
        } catch (error) {
            toast.error('Error creating backup');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadBackups = async () => {
        try {
            const res = await fetch('/api/backup');
            const data = await res.json();
            setBackups(data.backups || []);
            setStats({ total: data.total || 0, totalSize: data.totalSize || 0 });
        } catch (error) {
            console.error('Error loading backups:', error);
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Database Backups</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {stats.total} backup{stats.total !== 1 && 's'} • Total: {formatBytes(stats.totalSize)}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={loadBackups}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>

                    <button
                        onClick={createBackup}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Database className="h-4 w-4" />
                                Create Backup
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Last Backup Notice */}
            {lastBackup && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-medium text-green-900 dark:text-green-100">
                            Backup created successfully
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            {lastBackup.backup} ({lastBackup.sizeFormatted})
                        </p>
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Automatic Cleanup</p>
                    <p>Backups older than 30 days are automatically deleted to save space.</p>
                </div>
            </div>

            {/* Backups List */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Available Backups</h3>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {backups.length > 0 ? (
                        backups.map((backup) => (
                            <div key={backup.name} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                        <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{backup.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(backup.created).toLocaleString('pl-PL')} • {backup.sizeFormatted}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors text-indigo-600 dark:text-indigo-400"
                                        title="Download backup"
                                    >
                                        <Download className="h-4 w-4" />
                                    </button>
                                    <button
                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
                                        title="Delete backup"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center">
                            <Database className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                No backups found
                            </p>
                            <button
                                onClick={createBackup}
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Create your first backup
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📌 Instructions</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Backups are stored in the <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">backups/</code> directory</li>
                    <li>• Create manual backups before major changes</li>
                    <li>• Old backups (30+ days) are automatically deleted</li>
                    <li>• Download backups to store externally for safety</li>
                </ul>
            </div>
        </div>
    );
}
