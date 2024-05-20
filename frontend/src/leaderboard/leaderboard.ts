import { API_URL } from '../utils/constants';
import ILeaderboard, { ILeaderboardEntry } from './interfaces/ILeaderboard';
import Swal from 'sweetalert2';

/**
 * Creates a new leaderboard object.
 * @returns The leaderboard object.
 */
export default function leaderboard(): ILeaderboard {
    return {
        leaderboard: [] as ILeaderboardEntry[],

        /**
         * Fetches the leaderboard data from the server.
         * @throws An error if the HTTP request fails or if the server returns an error.
         */
        fetchLeaderboard: async function (): Promise<void> {
            try {
                const response = await fetch(`${API_URL}/api/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ type: 'get_leaderboard' }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    this.leaderboard = data.leaderboard;
                } else {
                    Swal.fire({
                        title: 'Error fetching leaderboard',
                        text: 'Could not retrieve leaderboard data',
                        icon: 'error',
                    });
                }
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'An error occurred while fetching the leaderboard',
                    icon: 'error',
                });
            }
        },
    };
}