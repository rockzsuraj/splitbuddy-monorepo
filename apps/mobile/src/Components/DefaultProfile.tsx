import React, { useState } from 'react';
import { Image, View, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface DefaultProfileProps {
  uri?: string;
  loading?: boolean;  // <-- new
}

const DefaultProfile: React.FC<DefaultProfileProps> = ({ uri, loading }) => {
  console.log('loading *', loading);
  
  

  const showFallback = !uri || uri === "";

  return (
    <View
      style={{
        width: 150,
        height: 150,
        borderRadius: 75,
        padding: 4,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <LinearGradient
        colors={['#ff512f', '#dd2476']}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 75,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {showFallback || loading ? (
          <View
            style={{
              width: 140,
              height: 140,
              borderRadius: 70,
              backgroundColor: 'rgba(255,255,255,0.25)',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 3,
              borderColor: '#fff',
            }}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Ionicons name="person" color="#fff" size={70} />
            )}
          </View>
        ) : (
          <>
            {loading && (
              <ActivityIndicator
                size="large"
                color="#fff"
                style={{
                  position: 'absolute',
                  zIndex: 2,
                }}
              />
            )}

            <Image
              source={{ uri }}
              style={{
                width: 140,
                height: 140,
                borderRadius: 70,
                borderWidth: 3,
                borderColor: '#fff',
                opacity: loading ? 0.2 : 1,
              }}
            />
          </>
        )}
      </LinearGradient>
    </View>
  );
};

export default DefaultProfile;
