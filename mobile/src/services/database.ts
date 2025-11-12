import * as SQLite from 'expo-sqlite';
import { WakeSession } from '../types';

const db = SQLite.openDatabase('riserite.db');

export const initializeDatabase = async () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS wake_sessions (
            userId TEXT,
            date TEXT,
            pushupCount INTEGER,
            brushingSeconds INTEGER,
            wakeCompleted INTEGER,
            motivationTrack TEXT,
            timestamp INTEGER,
            PRIMARY KEY (userId, date)
          );`,
          [],
          () => {
            console.log('Database initialized');
            resolve();
          },
          (_, error) => {
            console.error('Error initializing database:', error);
            reject(error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Transaction error:', error);
        reject(error);
      }
    );
  });
};

export const saveWakeSession = async (session: WakeSession): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT OR REPLACE INTO wake_sessions 
           (userId, date, pushupCount, brushingSeconds, wakeCompleted, motivationTrack, timestamp)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            session.userId,
            session.date,
            session.pushupCount,
            session.brushingSeconds,
            session.wakeCompleted ? 1 : 0,
            session.motivationTrack || null,
            session.timestamp,
          ],
          () => {
            console.log('Session saved locally');
            resolve();
          },
          (_, error) => {
            console.error('Error saving session:', error);
            reject(error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Transaction error:', error);
        reject(error);
      }
    );
  });
};

export const getWakeSessions = async (userId: string): Promise<WakeSession[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM wake_sessions WHERE userId = ? ORDER BY timestamp DESC',
        [userId],
        (_, { rows }) => {
          const sessions: WakeSession[] = [];
          for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            sessions.push({
              userId: row.userId,
              date: row.date,
              pushupCount: row.pushupCount,
              brushingSeconds: row.brushingSeconds,
              wakeCompleted: row.wakeCompleted === 1,
              motivationTrack: row.motivationTrack,
              timestamp: row.timestamp,
            });
          }
          resolve(sessions);
        },
        (_, error) => {
          console.error('Error fetching sessions:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};


