package com.example.mentalhealthreporter;

import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;

public class MyNotificationListenerService extends NotificationListenerService {

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        String packageName = sbn.getPackageName();
        String title = sbn.getNotification().extras.getString("android.title");
        CharSequence text = sbn.getNotification().extras.getCharSequence("android.text");
        saveNotificationToFile("App: " + packageName + ", Title: " + title + ", Text: " + text);
        Log.d("Notification", "App: " + packageName + ", Title: " + title + ", Text: " + text);
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        Log.d("Notification", "Notification removed from: " + sbn.getPackageName());
    }

    private void saveNotificationToFile(String notificationText) {
        try {
            File file = new File(getExternalFilesDir(null), "notifications.txt");

            FileWriter writer = new FileWriter(file, true); // true for append mode
            BufferedWriter bufferedWriter = new BufferedWriter(writer);

            bufferedWriter.write(notificationText);
            bufferedWriter.newLine();

            bufferedWriter.close();
            writer.close();

            Log.d("NotificationLog", "Saved notification to " + file.getAbsolutePath());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}