package com.example.mentalhealthreporter;

import android.app.Service;
import android.content.Intent;
import android.net.VpnService;
import android.os.IBinder;
import android.os.ParcelFileDescriptor;
import android.util.Log;

import java.io.FileDescriptor;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.ByteBuffer;

public class TrafficVpnService extends VpnService {
    private ParcelFileDescriptor vpnInterface;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Builder builder = new Builder();
        builder.setSession("VPN Monitor")
                .addAddress("10.0.0.2", 32)
                .addRoute("0.0.0.0", 0); // route all traffic

        vpnInterface = builder.establish();
        startSniffing(vpnInterface.getFileDescriptor());
        return START_STICKY;
    }

    private void startSniffing(FileDescriptor fd) {
        new Thread(() -> {
            try (FileInputStream in = new FileInputStream(fd)) {
                ByteBuffer buffer = ByteBuffer.allocate(32767);
                while (true) {
                    int length = in.read(buffer.array());
                    if (length > 0) {
                        buffer.limit(length);
                        parsePacket(buffer);
                        buffer.clear();
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private void parsePacket(ByteBuffer buffer) {
        // Optional: Parse packet here to get IP, port, etc.
        // Log.d("VPN", "Packet intercepted: " + buffer.limit() + " bytes");
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < buffer.limit(); i++) {
            sb.append(String.format("%02X ", buffer.get(i)));  // Convert each byte to hex format
        }
        Log.d("VPN", "Packet Content: " + sb.toString());
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try {
            if (vpnInterface != null) vpnInterface.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
